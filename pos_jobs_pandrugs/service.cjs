require('dotenv').config();
const { MongoClient } = require('mongodb');
const { Client: PgClient } = require('pg');
const axios = require('axios');
const { Queue } = require('./data_utils.cjs');

const MONGODB_URI = process.env.MONGO_URI;
const EXTERNAL_API_URL = process.env.PANDRUGS_BASE_URL;
const POSTGRES_CONFIG = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
}

//const LOOP_INTERNAL_MS = 999999 //16.6 minutes aprox
//const LOOP_INTERNAL_MS = 99999 //1.66 minutes aprox
const LOOP_INTERNAL_MS = 9999 //10 seconds aprox
const MAX_VARIANT_ANALYSIS_PER_TICK = 10
const MAX_DRUG_QUERIES_PER_TICK = 10
const COMPUTATION_STATUS = {
  pending: 'PENDING',
  processing: 'PROCESSING',
  processed: 'PROCESSED'
}

let mongoClient;
let pgClient;
let annotation_queue = new Queue();
let analysis_queue = new Queue();

async function connectToDatabases() {
  // Connect to MongoDB
  mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  console.log('Connected to MongoDB');

  // Connect to Postgres
  pgClient = new PgClient(POSTGRES_CONFIG);
  await pgClient.connect();
  console.log('Connected to PostgreSQL');
}

async function closeConnections() {
  if (mongoClient) await mongoClient.close();
  if (pgClient) await pgClient.end();
  console.log('Connections closed');
}

function sleep() {
  return new Promise(resolve => setTimeout(resolve, 9999));
}

/**
 * Search for up to 10 variant annotations with state PENDING in postgres database 
 */
async function get_service_variant_annotation() {
  // 1. Fetch document IDs from Postgres
  const { rows } = await pgClient.query(`SELECT an.id, an."pdComputationId", an."documentId" FROM public.mmpc_annotation AS an INNER JOIN public.mmpc_computationstatus AS cs ON an.status_id = cs.id WHERE cs."computationStatus" = $1 ORDER BY date ASC LIMIT $2`, [COMPUTATION_STATUS.pending, MAX_VARIANT_ANALYSIS_PER_TICK]);

  for (const row of rows) {
    annotation_queue.enqueue(row)
  }
  console.log("END GET PENDING ANNOTATIONS");
}

/**
 * Gets pandrugs variant annotation (variant analysis) state by its computation id
 */
async function get_pandrugs_annotation(computation_id) {
  request_url = EXTERNAL_API_URL + 'variantsanalysis/guest/' + computation_id;
  console.log("WEKYWEKY______________:" + computation_id);
  try {
    const pandrugs_answer = await axios.get(request_url, {
      headers: {
        'Authorization': process.env.PANDRUGS_AUTH
      }
    });
    return pandrugs_answer.data;
  }
  catch (error) {
    console.log("AXIOS ERROR: " + error);
    return null;
  };
}

/**
 * Gets pandrugs analysis (drug query) result by computation id and cancer types
 */
async function get_pandrugs_analysis(computation_id, cancer_types) {
  console.log(computation_id);
  try {
    request_url = EXTERNAL_API_URL + 'genedrug/fromComputationId?' +
      'computationId=' + computation_id + '&' +
      'cancerDrugStatus=APPROVED&' +
      'cancerDrugStatus=CLINICAL_TRIALS&' +
      'nonCancerDrugStatus=CLINICAL_TRIALS&' +
      'nonCancerDrugStatus=APPROVED&' +
      'directTarget=true&' +
      'geneDependency=true&' +
      'biomarker=true&' +
      'pathwayMember=false&';
    cancer_types.forEach(cancer_type => {
      request_url += 'cancer=' + cancer_type + '&';
    });

    console.log(request_url);


    const pandrugs_answer = await axios.get(request_url, {
      headers: {
        'Authorization': process.env.PANDRUGS_AUTH
      }
    });

    //console.log(pandrugs_answer.data);
    return pandrugs_answer.data;
  }
  catch (error) {
    console.log("ERRORsito: " + error);
    return null;
  };
}

/**
 * Gets a set of analyses with computationStatus=PENDING AND which parent annotation has computationStatus=PROCESSED
 */
async function get_service_analyses() {
  try {
    const { rows } = await pgClient.query(`SELECT a.id AS analysis_id, a."cancerTypes", a.annotation_id, cs_an."computationStatus" AS "annotationStatus", a."documentId" AS "analysisDocumentId", an."pdComputationId" FROM public.mmpc_analysis AS a INNER JOIN public.mmpc_annotation AS an ON a.annotation_id=an.id INNER JOIN public.mmpc_computationstatus AS cs_a ON a.status_id = cs_a.id INNER JOIN public.mmpc_computationstatus AS cs_an ON an.status_id = cs_an.id WHERE cs_a."computationStatus" = $1 AND cs_an."computationStatus" = $2 ORDER BY a.date ASC LIMIT $3`, [COMPUTATION_STATUS.pending, COMPUTATION_STATUS.processed, MAX_DRUG_QUERIES_PER_TICK]);
    rows.forEach(row => analysis_queue.enqueue(row));
  }
  catch (error) {
    console.log("ERRORsete: " + error)
  }

  console.log("DRUG QUERIES FOUND: " + analysis_queue.length());
}

/**
 * Sets variant analysis status
 */
async function set_service_annotation(annotation_id, new_status, document_id) {
  try {
    const new_status_obj = await pgClient.query('SELECT cs.id from public.mmpc_computationstatus AS cs WHERE cs."computationStatus" = $1', [new_status]);
    await pgClient.query('UPDATE public.mmpc_annotation SET "documentId" = $1, status_id = $2 WHERE id = $3', [document_id, new_status_obj.rows[0].id, annotation_id]);
  }
  catch (error) {
    console.log("ERROR WHEN UPDATING ANNOTATION ENTRY: " + error);
  }
}

/**
 * Sets drug query status and document_id
 */
async function set_service_analysis(analysis_id, new_status, document_id) {
  console.log("GAMBERRO: " + analysis_id + new_status + document_id);
  try {
    const new_status_obj = await pgClient.query('SELECT cs.id from public.mmpc_computationstatus AS cs WHERE cs."computationStatus" = $1', [new_status]);
    await pgClient.query('UPDATE public.mmpc_analysis SET "documentId" = $1, status_id = $2 WHERE id = $3', [document_id, new_status_obj.rows[0].id, analysis_id]);
  }
  catch (error) {
    console.log("DATABASE OPERATION ERROR: " + error);
  }
}

async function mainLoop() {
  const mongoDb = mongoClient.db(process.env.MONGO_DB);
  const variantAnalysisCollection = mongoDb.collection(process.env.MONGO_COLLECTION_ANALYSIS);
  const drugQueryCollection = mongoDb.collection(process.env.MONGO_COLLECTION_DRUGQUERY);
  const reportCollection = mongoDb.collection(process.env.MONGO_COLLECTION_DRUGQUERY);

  while (true) {
    annotation_queue = new Queue();
    analysis_queue = new Queue();

    try {
      //console.log("Loop tick:", new Date().toISOString()); //For debugging

      // === EXAMPLE LOGIC ===




      /*
      [PIPELINE]
      - CHECK STATE OF CURRENTLY PENDING ANNOTATION TASKS [SAVED IN THE CURRENT TASK LIST]
      - IF TASK IS COMPLETED, GET DOCUMENT AND SAVE INTO MONGO DATABASE
      - RUN PENDING ANALYSES FOR THAT TASK
      - WHEN ANALYSIS IS COMPLETED, GET DOCUMENT AND SAVE INTO MONGO DATABASE
      - IF NO ANALYSES REMAINING FOR THAT TASK, REPEAT FOR NEXT ANNOTATION
      - IF NO ANNOTATIONS ON THE LIST, CHECK FOR NEW ONES IN POSTGRES DATABASE
      - IF NO ANALYSES ON THE LIST; CHECK FOR NEW ONES IN POSTGRES DATABASE
      - MAX_CONCURRENT_VARIANT_ANALYSIS = 10
      - MAX_CONCURRENT_DRUG_QUERY = 10
      - EACH TICK, MAKE ONE TASK FOR EACH DOCUMENT TYPE (VARIANT ANALYSIS, DRUG QUERY)
      */

      if (annotation_queue.length() < 1) {
        await get_service_variant_annotation(); // Get A SET OF PENDING VARIANT ANALYSIS
        console.log("variant analysis length: " + annotation_queue.length())
      }

      if (annotation_queue.length() > 0) {
        for (const annotation of annotation_queue.queue) {
          console.log("ANNNNNNNNNNNNNNNNNNNN: " + JSON.stringify(annotation));
          try {
            pandrugs_annotation = await get_pandrugs_annotation(annotation.pdComputationId);
            //CHECK IF ANALYSIS IS READY. IF NOT, CONTINUE
            if (pandrugs_annotation.finished == true) {
              // IF READY
              // SAVE VARIANT ANALYSIS DOCUMENT INTO MONGODB
              const insert_result = await variantAnalysisCollection.insertOne(pandrugs_annotation);
              // SAVE VARIANT ANALYSIS DOCUMENT ID INTO SERVICE DATABASE
              const document_id = insert_result.insertedId;
              // SAVE DOCUMENT ID AND MARK THE STATE AS PROCESSED IN SERVICE DATABASE'S CORRESPONDING ENTRY
              set_service_annotation(annotation.id, COMPUTATION_STATUS.processed, document_id);
            }
          }
          catch (exception) {
            console.log("EXCEPTION WORKING WITH DATABASE: " + exception);
          }


          //LOOK FOR CORRESPONDING PENDING SERVICE DRUG QUERIES
          //FOR EACH DRUG QUERY, AWAIT EXECUTE
          //FOR EACH RESULT, SAVE RESULT INTO DOCUMENT DATABASE
          //MARK THE DOCUMENT RESULT ID INTO SERVER DATABASE'S CORRESPONDING DRUG QUERY ENTRY, AND SET THE STATE
          //console.log(pandrugs_analysis);
        }
      }

      if (analysis_queue.length() < 1) {
        try {
          await get_service_analyses(); // Get A SET OF PENDING DRUG QUERIES
        }
        catch (exception) {
          console.log("EXCEPTION WORKING WITH DATABASE: " + exception);
        }
      }

      //TODO: CHECK FOR PENDING DRUG QUERIES WITH ALREADY COMPLETED CORRESPONDING VARIANT ANALYSIS
      //await get_service_drug_queries();
      //IF PENDING QUERIES, EXECUTE THEM SEQUENTIALLY
      if (analysis_queue.length() > 0) {
        for (const query of analysis_queue.queue) {
          console.log("QUERY: " + JSON.stringify(query));
          await get_pandrugs_analysis(query.pdComputationId, query.cancerTypes)
            .then(async (result) => {
              console.log("E");
              //SAVE RESULT INTO MONGODB AND GET THE GENERATED ID
              const insert_result = await drugQueryCollection.insertOne(result);
              const document_id = insert_result.insertedId;
              //console.log("MONGO ID: " + document_id);
              //UPDATE SERVICE DRUG QUERY ENTRY WITH THE DOCUMENT ID
              //AND SET STATUS TO COMPLETED
              //console.log(JSON.stringify(query));
              await set_service_analysis(query.analysis_id, COMPUTATION_STATUS.processed, document_id)
                .then(() => {
                  console.log("UPDATED DRUGQUERY SUCCESSFULLY")
                  console.log("DRUG QUERY JOB FINISHED SUCCESSFULLY");
                })
                .catch((error) => { console.log("ERROR WHEN UPDATING ANALYSIS ENTRY: ") });
              //.catch((error)=>{console.log("ERROR WHEN UPDATING DRUGQUERY ENTRY: " + error)});
            })
            .catch((error) => {
              console.log("ERROR WHEN APPLYING ANALYSIS JOB: " + error);
              //console.log("ERROR WHEN APPLYING ANALYSIS JOB: ");
            });
        }
      }

      // 2. Simulate fetching a document (replace with actual fetch)
      /* const document = {
        externalId,
        content: `Fetched content for ${externalId}`,
      };
 
      // 3. Insert into MongoDB
      const insertResult = await documentsCollection.insertOne(document);
      const mongoId = insertResult.insertedId;
 
      // 4. Update Postgres with MongoDB ID
      await pgClient.query('UPDATE external_documents SET mongo_id = $1, processed = true WHERE id = $2', [mongoId, externalId]);
 
      console.log(`Processed document ${externalId} -> Mongo ID ${mongoId}`);*/


    } catch (err) {
      console.error("Error in main loop:", err);

      // try to reconnect
      await closeConnections();
      await sleep(5000); // Wait a bit before retrying
      try {
        await connectToDatabases();
        console.log("Reconnected after error");
      } catch (connErr) {
        console.error("Failed to reconnect, exiting...");
        process.exit(1);
      }
    }

    // Wait before next iteration
    await sleep();
  }
}

(async () => {
  try {
    await connectToDatabases();
    await mainLoop();
  } catch (startupError) {
    console.error("Startup failure:", startupError);
    await closeConnections();
    process.exit(1);
  }
})();