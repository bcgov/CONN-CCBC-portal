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

{{- define "ccbc.ccbcUserPgEnv" }}
- name: PGUSER
  valueFrom:
    secretKeyRef:
      key: user
      name: ccbc-pguser-ccbc
- name: PGPASSWORD
  valueFrom:
    secretKeyRef:
      key: password
      name: ccbc-pguser-ccbc
- name: PGDATABASE
  valueFrom:
    secretKeyRef:
      key: dbname
      name: ccbc-pguser-ccbc
- name: PGPORT
  valueFrom:
    secretKeyRef:
      key: pgbouncer-port
      name: ccbc-pguser-ccbc
- name: PGHOST
  valueFrom:
    secretKeyRef:
      key: pgbouncer-host
      name: ccbc-pguser-ccbc
{{- end }}
