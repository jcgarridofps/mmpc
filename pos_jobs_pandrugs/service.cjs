require('dotenv').config();
const { MongoClient } = require('mongodb');
const { Client: PgClient } = require('pg');
const axios = require('axios');
const {Queue} = require('./data_utils.cjs');

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
const JOB_STATUS = {
  pending:'PENDING',
  processing: 'PROCESSING',
  processed: 'PROCESSED'
}

let mongoClient;
let pgClient;
let variant_analysis_queue = new Queue();
let drug_query_queue = new Queue();

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
   * Search for up to 10 variant analysis with state PENDING in postgres database 
   */ 
  async function get_service_variant_analysis(){
    // 1. Fetch document IDs from Postgres
    const { rows } = await pgClient.query(`SELECT id, computation_id FROM public.mmpc_variantanalysis WHERE status = $1 ORDER BY date ASC LIMIT $2`, [JOB_STATUS.pending, MAX_VARIANT_ANALYSIS_PER_TICK]);
    
    for (const row of rows) {
      variant_analysis_queue.enqueue(row)
    }
    console.log("END GET VARIANT ANALYSIS");
  }

  /**
   * Gets pandrugs variant analysis state by its computation id
   */
  async function get_pandrugs_variant_analysis(computation_id){
    request_url = EXTERNAL_API_URL + 'variantsanalysis/guest/' + computation_id;
    
    try{
      const pandrugs_answer = await axios.get(request_url, {
        headers:{
          'Authorization': process.env.PANDRUGS_AUTH
        }
      });
      return pandrugs_answer.data;
    }
    catch(error) {
      console.log("AXIOS ERROR: " + error);
      return null;
    };
  }

  /**
   * Gets pandrugs drug query result by computation id and cancer types
   */
  async function get_pandrugs_drugQuery(computation_id, cancer_types){
    try{
      request_url = EXTERNAL_API_URL + 'genedrug/fromComputationId?' + 
      'computationId=' + computation_id + '&' +
      'cancerDrugStatus=APPROVED&' +
      'cancerDrugStatus=CLINICAL_TRIALS&' +
      'nonCancerDrugStatus=CLINICAL_TRIALS&' +
      'nonCancerDrugStatus=APPROVED&' +
      'directTarget=true&' +
      'geneDependency=true&';
      JSON.parse(cancer_types).forEach(cancer_type => {
        request_url += 'cancer=' + cancer_type + '&';
      });

      //console.log(request_url);
    
    
      const pandrugs_answer = await axios.get(request_url, {
        headers:{
          'Authorization': process.env.PANDRUGS_AUTH
        }
      });

      console.log(pandrugs_answer.data);
      return pandrugs_answer.data;
    }
    catch(error) {
      console.log("ERRORsito: " + error);
      return null;
    };
  }

  /**
   * Gets a set of drug queries with status=PENDING
   */
  async function get_service_drug_queries(){
    try{
      const { rows } = await pgClient.query(`SELECT public.mmpc_drugquery.id, public.mmpc_drugquery.cancer_types, public.mmpc_drugquery.variant_analysis_id, public.mmpc_variantanalysis.computation_id FROM public.mmpc_drugquery INNER JOIN public.mmpc_variantanalysis ON public.mmpc_drugquery.variant_analysis_id=public.mmpc_variantanalysis.id WHERE public.mmpc_drugquery.status = $1 ORDER BY public.mmpc_drugquery.date ASC LIMIT $2`,[JOB_STATUS.pending, MAX_DRUG_QUERIES_PER_TICK]);
    for (const row of rows) {
      // GET PARENT VARIANT ANALYSIS FROM SERVICE DATABASE
      const { rows } = await pgClient.query(`SELECT status FROM public.mmpc_variantanalysis WHERE id = $1`, [row.variant_analysis_id]);
      // IF PARENT ANALYSIS STATUS PROCESSING IS DONE, WE CAN ADD THE DRUG QUERY TO THE QUEUE
      if(rows[0].status == JOB_STATUS.processed){
        drug_query_queue.enqueue(row);
      }
    }
    }
    catch(error){
      console.log("ERRORsete: " + error)
    }

    console.log("DRUG QUERIES FOUND: " + drug_query_queue.length());
  }

  /**
   * Gets a set of drug queries with status=PENDING
   */
  // Cuidado, que aquí necesitamos también incluir las drug queries de análisis que ya estén completados, y habrá que confirmar que los análisis estén completados antes de aceptar o no la inclusión de las drug queries. Esto es como lo tenía justamente antes, que se ha descartado, pero no tiene realmente sentido descartarlo. Es más, seguramente sea más interesante sacar las drug queries de esta forma y no partiendo de los análisis que acaban de confirmarse como terminados.
  /*async function get_service_drug_queries(parent_analysis_id){
    const { rows } = await pgClient.query(`SELECT id, cancer_types FROM public.mmpc_drugquery WHERE variant_analysis_id = $1 AND status = $2 ORDER BY date ASC LIMIT $3`,[parent_analysis_id, JOB_STATUS.pending, MAX_DRUG_QUERIES_PER_TICK]);
    for (const row of rows) {drug_query_queue.enqueue(row);}

    console.log("DRUG QUERIES FOUND: " + drug_query_queue.queue.length());
  }*/

  /**
   * Sets variant analysis status
   */
  async function set_service_variant_analysis(variant_analysis_id, new_status, document_id){
    try{
      await pgClient.query('UPDATE public.mmpc_variantanalysis SET document_id = $1, status = $2 WHERE id = $3', [document_id, new_status, variant_analysis_id]);
    }
    catch(error){
      console.log("ERROR WHEN UPDATING VARIANTANALYSIS ENTRY: " + error);
    }
  }

  /**
   * Sets drug query status and document_id
   */
  async function set_service_drug_query(drug_query_id, new_status){
    try{
      await pgClient.query('UPDATE public.mmpc_drugquery SET status = $1 WHERE id = $2', [new_status, drug_query_id]);
    }
    catch(error){
      console.log("DATABASE OPERATION ERROR: " + error);
    }
  }

  async function mainLoop() {
    const mongoDb = mongoClient.db(process.env.MONGO_DB);
    const variantAnalysisCollection = mongoDb.collection(process.env.MONGO_COLLECTION_ANALYSIS);
    const drugQueryCollection = mongoDb.collection(process.env.MONGO_COLLECTION_DRUGQUERY);
    const reportCollection = mongoDb.collection(process.env.MONGO_COLLECTION_DRUGQUERY);
  
    while (true) {
      variant_analysis_queue = new Queue();
      drug_query_queue = new Queue();

       try {
        //console.log("Loop tick:", new Date().toISOString()); //For debugging
  
        // === EXAMPLE LOGIC ===
  
        


          /*
          [PIPELINE]
          - CHECK STATE OF CURRENTLY PENDING VARIANT ANALYSIS TASKS [SAVED IN THE CURRENT TASK LIST]
          - IF TASK IS COMPLETED, GET DOCUMENT AND SAVE INTO MONGO DATABASE
          - RUN PENDING DRUG QUERY FOR THAT TASK
          - IF QUERY IS COMPLETED, GET DOCUMENT AND SAVE INTO MONGO DATABASE
          - IF NO DRUG QUERY REMAINING FOR THAT TASK, REPEAT FOR NEXT VARIANT ANALYSIS
          - IF NOT VARIANT ANALYSIS ON THE LIST, CHECK FOR NEW ONES IN POSTGRES DATABASE
          - IF NOT DRUG QUERY ON THE LIST; CHECK FOR NEW ONES IN POSTGRES DATABASE
          - MAX_CONCURRENT_VARIANT_ANALYSIS = 10
          - MAX_CONCURRENT_DRUG_QUERY = 10
          - EACH TICK, MAKE ONE TASK FOR EACH DOCUMENT TYPE (VARIANT ANALYSIS, DRUG QUERY)
          */

          if(variant_analysis_queue.length() < 1){
            await get_service_variant_analysis(); // Get A SET OF PENDING VARIANT ANALYSIS
            console.log("variant analysis length: " + variant_analysis_queue.length())
          }

          if(variant_analysis_queue.length() > 0){
            for (const analysis of variant_analysis_queue.queue){
              try{
                pandrugs_analysis = await get_pandrugs_variant_analysis(analysis.computation_id);
                //CHECK IF ANALYSIS IS READY. IF NOT, CONTINUE
                if (pandrugs_analysis.finished == true){
                  // IF READY
                  // SAVE VARIANT ANALYSIS DOCUMENT INTO MONGODB
                  const insert_result =  await variantAnalysisCollection.insertOne(pandrugs_analysis);
                  // SAVE VARIANT ANALYSIS DOCUMENT ID INTO SERVICE DATABASE
                  const document_id = insert_result.insertedId;
                  // SAVE DOCUMENT ID AND MARK THE STATE AS PROCESSED IN SERVICE DATABASE'S CORRESPONDING ENTRY
                  set_service_variant_analysis(analysis.id, JOB_STATUS.processed, document_id);
                }
              }
              catch(exception){
                console.log("EXCEPTION WORKING WITH DATABASE: " + exception);
              }
              
              
              //LOOK FOR CORRESPONDING PENDING SERVICE DRUG QUERIES
              //FOR EACH DRUG QUERY, AWAIT EXECUTE
              //FOR EACH RESULT, SAVE RESULT INTO DOCUMENT DATABASE
              //MARK THE DOCUMENT RESULT ID INTO SERVER DATABASE'S CORRESPONDING DRUG QUERY ENTRY, AND SET THE STATE
              //console.log(pandrugs_analysis);
            }
          }

          if(drug_query_queue.length() < 1){
            try{
              await get_service_drug_queries(); // Get A SET OF PENDING DRUG QUERIES
            }
            catch(exception){
              console.log("EXCEPTION WORKING WITH DATABASE: " + exception);
            }
          }

          //TODO: CHECK FOR PENDING DRUG QUERIES WITH ALREADY COMPLETED CORRESPONDING VARIANT ANALYSIS
          //await get_service_drug_queries();
          //IF PENDING QUERIES, EXECUTE THEM SEQUENTIALLY
          if(drug_query_queue.length() > 0){
            for (const query of drug_query_queue.queue){
              await get_pandrugs_drugQuery(query.computation_id, query.cancer_types)
              .then(async(result)=>{
                console.log("E");
                //SAVE RESULT INTO MONGODB AND GET THE GENERATED ID
                const insert_result = await drugQueryCollection.insertOne(result);
                const document_id = insert_result.insertedId;
                //console.log("MONGO ID: " + document_id);
                //UPDATE SERVICE DRUG QUERY ENTRY WITH THE DOCUMENT ID
                //AND SET STATUS TO COMPLETED
                //console.log(JSON.stringify(query));
                await pgClient.query(`UPDATE public.mmpc_drugquery SET document_id = $1, status = $2 WHERE id = $3`,[document_id, JOB_STATUS.processed, query.id])
                .then(()=>{
                  console.log("UPDATED DRUGQUERY SUCCESSFULLY")
                  console.log("DRUG QUERY JOB FINISHED SUCCESSFULLY");
                })
                .catch((error)=>{console.log("ERROR WHEN UPDATING DRUGQUERY ENTRY: ")});
                //.catch((error)=>{console.log("ERROR WHEN UPDATING DRUGQUERY ENTRY: " + error)});
              })
              .catch((error)=>{
                console.log("ERROR WHEN APPLYING DRUG QUERY JOB: " + error);
                //console.log("ERROR WHEN APPLYING DRUG QUERY JOB: ");
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