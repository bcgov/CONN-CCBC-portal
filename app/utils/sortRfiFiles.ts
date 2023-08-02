const fileList = {};

const appendRfiFiles = (rfiFiles, rfiNumber) => {
  // append Rfi files to fileList

  // remove non array fields from rfi files
  const fileFields =
    rfiFiles &&
    Object.keys(rfiFiles).filter(
      (field) => Array.isArray(rfiFiles[field]) && rfiFiles[field].length > 0
    );

  // append rfi files to fileList in an object named after the rfi number
  fileFields?.forEach((field) => {
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
