import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

const aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const sendJSONToIPFS = async (json: any) => {
  const formData = new FormData();
  formData.append('file', json);

  try {
    const response = await axios.post('https://ipfs.infura.io:5001/api/v0/add', formData, {
      headers: formData.getHeaders(),
    });

    response.data.Status = 200;
    response.data.Message = 'Success';

    return { Status: 200, Response: 'File uploaded', Ipfs: response.data };
  } catch (error) {
    return error;
  }
};

const post = async (req: any, res: any) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, response: 'Forma parse error', error: String(err) });
    }

    if ('file' in files) {
      const responseAxios = await sendFileToIPFS(files.file);
      const filename = `${responseAxios.Ipfs.Hash}.${files.file.originalFilename.split('.').pop()}`;
      sendFileToS3(files.file, filename);
      return res.status(200).json({ ipfs: responseAxios.Ipfs.Hash, filename });
    }
    if ('metadata' in fields) {
      const responseAxios = await sendJSONToIPFS(fields.metadata);
      sendJsonToS3(fields.metadata, `${responseAxios?.Ipfs.Hash}.json`);
      return res.status(200).json({ tokenUri: responseAxios?.Ipfs.Hash });
    }
  });
};

const sendFileToIPFS = async (file: any) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(file.filepath));

  const headers = formData.getHeaders();
  const ipfsUrl = 'https://ipfs.infura.io:5001/api/v0/add';

  try {
    const response = await axios.post(ipfsUrl, formData, {
      headers,
    });

    response.data.Status = 200;
    response.data.Message = 'Success';

    return {
      Status: 200,
      Response: 'File uploaded',
      Ipfs: response.data,
    };
  } catch (error) {
    return `IPFS_Error: ${error?.message}`;
  }
};

const sendFileToS3 = async (file: any, newFileName: any) => {
  const fileContent = fs.createReadStream(file.filepath);

  const params = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: newFileName,
    Body: fileContent,
  };

  s3.upload(params, (err: any, data: any) => {
    if (err) throw err;
    console.log(`File uploaded: ${data.Location}`);
  });
};

const sendJsonToS3 = async (json: any, newFileName: any) => {
  const params = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: newFileName,
    Body: json,
  };

  s3.upload(params, (err: any, data: any) => {
    if (err) throw err;
    console.log(`Json uploaded: ${data.Location}`);
  });
};

// GET
const get = async (req: any, res: any) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (fields: any) => res.status(200).json(JSON.stringify(fields)));
};

export default (req: any, res: any) => {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? console.log('PUT')
    : req.method === 'DELETE'
    ? console.log('DELETE')
    : req.method === 'GET'
    ? get(req, res)
    : res.status(404).send('');
};
