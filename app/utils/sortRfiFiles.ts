const sortRfiFiles = (rfiNodes) => {
  const fileList = {};

  const appendRfiFiles = (rfiFiles, rfiNumber, attachments) => {
    // append Rfi files to fileList

    // remove non array fields from rfi files
    const fileFields =
      rfiFiles &&
      Object.keys(rfiFiles).filter(
        (field) => Array.isArray(rfiFiles[field]) && rfiFiles[field].length > 0
      );

    // unite rfi files with attachment data so we can get the date uploaded
    const unitedRfiFiles = {};
    fileFields.forEach((field) => {
      unitedRfiFiles[field] = rfiFiles[field].map((file, i) => {
        const attachmentData = attachments.find(
          (attachment) => attachment.file === file.uuid
        );

        return {
          ...rfiFiles[field][i],
          ...attachmentData,
        };
      });
    });

    // append rfi files to fileList in an object named after the rfi number
    fileFields?.forEach((field) => {
      fileList[field] = {
        ...fileList[field],
        [rfiNumber]: unitedRfiFiles[field],
      };
    });
  };

  // loop through each rfi
  rfiNodes?.forEach((edge) => {
    const { rfiDataByRfiDataId } = edge.node;
    const { jsonData, rfiNumber } = rfiDataByRfiDataId;
    const attachments = rfiDataByRfiDataId?.attachments?.nodes;

    return appendRfiFiles(jsonData?.rfiAdditionalFiles, rfiNumber, attachments);
  });

  return fileList;
};

export default sortRfiFiles;
