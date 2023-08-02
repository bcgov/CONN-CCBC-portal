import {
  templateUploads,
  coverage,
  supportingDocuments,
} from 'formSchema/pages';

const fileList = {};

[
  ...Object.keys(templateUploads.templateUploads.properties),
  ...Object.keys(coverage.coverage.properties),
  ...Object.keys(supportingDocuments.supportingDocuments.properties),
].forEach((field) => {
  fileList[field] = {};
});

const appendRfiFiles = (rfiFiles, rfiNumber) => {
  // append Rfi files to fileList

  // remove non array fields from rfi files
  const fileFields = Object.keys(rfiFiles).filter(
    (field) => Array.isArray(rfiFiles[field]) && rfiFiles[field].length > 0
  );

  // append rfi files to fileList in an object named after the rfi number
  fileFields.forEach((field) => {
    fileList[field] = { ...fileList[field], [rfiNumber]: rfiFiles[field] };
  });
};

const sortRfiFiles = (rfiNodes) => {
  rfiNodes?.forEach((edge) => {
    const { rfiDataByRfiDataId } = edge.node;
    const { jsonData, rfiNumber } = rfiDataByRfiDataId;

    return appendRfiFiles(jsonData?.rfiAdditionalFiles, rfiNumber);
  });
  return fileList;
};

export default sortRfiFiles;
