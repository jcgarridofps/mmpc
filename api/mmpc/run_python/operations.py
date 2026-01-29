def backfill_patient_ids(apps, schema_editor):
    Patient = apps.get_model("mmpc", "Patient")
    from mmpc.models import generate_default_patient_id

    for patient in Patient.objects.filter(appId__isnull=True):
        new_id = generate_default_patient_id()
        while Patient.objects.filter(appId=new_id).exists():
            new_id = generate_default_patient_id()
        patient.appId = new_id
        patient.save()