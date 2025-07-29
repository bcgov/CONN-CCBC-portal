{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "ccbc.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common Labels
*/}}
{{- define "ccbc.labels" -}}
app.kubernetes.io/name: {{ .Values.fullnameOverride }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "ccbc.postgresPgEnv" }}
  - name: PGUSER
    value: postgres
  - name: PGPASSWORD
    valueFrom:
      secretKeyRef:
        key: password
        name: ccbc-pguser-postgres
  - name: PGPASSWORD_DEV
    valueFrom:
      secretKeyRef:
        key: password
        name: ccbc-pguser-postgres
  - name: TEST_PG_PASSWORD
    valueFrom:
      secretKeyRef:
        key: database-test-password
        name: {{ template "ccbc.fullname" . }}
  - name: PGDATABASE
    value: {{ template "ccbc.fullname" . }}
  - name: PGPORT
    valueFrom:
      secretKeyRef:
        key: port
        name: ccbc-pguser-postgres
  - name: PGHOST
    valueFrom:
      secretKeyRef:
        key: host
        name: ccbc-pguser-postgres
{{- end }}

{{- define "ccbc.ccbcUserPgEnv" }}
  - name: PGUSER
    value: {{ template "ccbc.fullname" . }}
  - name: PGPASSWORD
    valueFrom:
      secretKeyRef:
        key: password
        name: ccbc-pguser-ccbc
  - name: PGDATABASE
    value: {{ template "ccbc.fullname" . }}
  - name: PGPORT
    valueFrom:
      secretKeyRef:
        key: port
        name: ccbc-pguser-ccbc
  - name: PGHOST
    valueFrom:
      secretKeyRef:
        key: host
        name: ccbc-pguser-ccbc
{{- end }}

{{- define "ccbc.ccbcAppUserPgEnv" }}
  - name: PGUSER
    value: ccbc_app
  - name: PGDATABASE
    value: {{ template "ccbc.fullname" . }}
  - name: PGHOST
    valueFrom:
      secretKeyRef:
        key: host
        name: ccbc-pguser-ccbc
  - name: PGPASSWORD
    valueFrom:
      secretKeyRef:
        key: database-app-password
        name: ccbc
{{- end }}
