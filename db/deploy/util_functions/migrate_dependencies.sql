-- Deploy ccbc:util_functions/migrate_dependencies to pg

BEGIN;

DO $$
DECLARE
    record RECORD;
    new_json_data JSONB;
    connected_coast_network_dependent TEXT;
    crtc_project_dependent TEXT;
BEGIN
    FOR record IN
        SELECT *
        FROM ccbc_public.assessment_data
        WHERE assessment_data_type = 'screening' AND archived_at IS NULL
    LOOP
        -- Extract values with null-check and casting, using 'TBD', 'Yes', and 'No'
        connected_coast_network_dependent :=
            CASE
                WHEN record.json_data->>'connectedCoastNetworkDependent' IS NOT NULL
                THEN
                    CASE
                        WHEN (record.json_data->>'connectedCoastNetworkDependent')::BOOLEAN
                        THEN 'Yes'
                        ELSE 'No'
                    END
                ELSE 'TBD'
            END;
        crtc_project_dependent :=
            CASE
                WHEN record.json_data->>'crtcProjectDependent' IS NOT NULL
                THEN
                    CASE
                        WHEN (record.json_data->>'crtcProjectDependent')::BOOLEAN
                        THEN 'Yes'
                        ELSE 'No'
                    END
                ELSE 'TBD'
            END;


        -- insert for all the existing applications
        INSERT INTO ccbc_public.application_dependencies (application_id, json_data, reason_for_change)
        VALUES (
            record.application_id,
            jsonb_build_object(
                'connectedCoastNetworkDependent', connected_coast_network_dependent,
                'crtcProjectDependent', crtc_project_dependent
            ),
            'Dependency fields moved from Screening Assessment to Technical Assessment'
        );

        -- Remove the fields from json_data by reassigning new_json_data
        SELECT record.json_data - 'connectedCoastNetworkDependent' - 'crtcProjectDependent'
        INTO new_json_data;

        -- Insert the new record with updated json_data
        INSERT INTO ccbc_public.assessment_data (
            application_id,
            assessment_data_type,
            json_data,
            created_at
        ) VALUES (
            record.application_id,
            record.assessment_data_type,
            new_json_data,
            now()
        );

        -- Archive the current row
        UPDATE ccbc_public.assessment_data
        SET archived_at = now()
        WHERE id = record.id;
    END LOOP;
END $$;


COMMIT;
