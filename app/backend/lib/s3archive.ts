import { Router } from 'express';
import archiver from 'archiver';

const s3archive = Router();

s3archive.get('/analyst/archive', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-disposition': 'attachment; filename=myFile.zip',
  });

  const archive = archiver('zip');

  // Send the archive to the route
  archive.pipe(res);

  // Appends entire /uploads directory to zip
  archive.directory('uploads/', false);

  archive.finalize();
});

export default s3archive;
