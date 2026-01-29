## PANDRUGS BRIDGE API MODULE

## 1. GetAnalysisResult
### GET http://127.0.0.1:8001/api/analysis/result/

### Authorization
Bearer [REQUIRED]

### Query parameters
analysis_id (string) [REQUIRED]

### Returns
Pandrugs analysis result (JSON)

### Status codes
200 OK

400 analysis_id not provided

404 No data for given analysis_id

500 Unexpected error

### Example
```sh
curl --location 'http://127.0.0.1:8001/api/analysis/result/?analysis_id=c297488b-bb3b-4313-ab6a-a11a93a4d3ce' \
--header 'Authorization: Bearer ******
```

## 2. PresenceCheck
Given a gen list, returns lists with those wich pandrugs has or not any treatment for.

### GET http://127.0.0.1:8001/api/analysis/presence/

### Authorization
Bearer [REQUIRED]

### Query parameters
gene (string) [REQUIRED][MULTIPLE]

### Returns
Genes present and absent (JSON)

```json
{
    "present": [
        "UNC13D"
    ],
    "absent": [
        "EPB41L4A"
    ]
}
```

### Status codes
200 OK

400 gene params not provided

500 Unexpected error

### Example
```sh
curl --location 'http://127.0.0.1:8001/api/analysis/presence/?gene=EPB41L4A&gene=UNC13D' \
--header 'Authorization: Bearer ******' 
```

## 3. NewVariantAnalysis
Starts a new analysis for a given vcf file

### POST http://127.0.0.1:8001/api/analysis/new/

### Authorization
Bearer [REQUIRED]

### Query parameters
name (string) [REQUIRED][MULTIPLE] | Name for the new analysis

### Body
vcf_file and file_name (form-data)
```sh
--form 'vcf_file=@"/home/user/Downloads/TCGA-BF-A1PU-01A-11D-A19A-08_hg38.vcf"' \
--form 'file_name="TCGA-BF-A1PU-01A-11D-A19A-08_hg38.vcf"'
```

### Returns
analysis_id generated for the new analysis (JSON)

```json
{
    "analysis_id": "f9f72ae8-ee92-45df-b1c9-61b381120dd6"
}
```

### Status codes
201 Created

400 name, vcf_file or file_name not provided

500 Unexpected error

### Example
```sh
curl --location 'http://127.0.0.1:8001/api/analysis/new/?name=test_1' \
--header 'Content-Type: multipart/form-data' \
--header 'Authorization: Bearer ******' \
--form 'vcf_file=@"/home/jcgarrido/Downloads/TCGA-BF-A1PU-01A-11D-A19A-08_hg38.vcf"' \
--form 'file_name="TCGA-BF-A1PU-01A-11D-A19A-08_hg38.vcf"'
```