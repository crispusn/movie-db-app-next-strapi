import { IncomingForm } from 'formidable';
import clodinary from 'cloudinary';
import { getTokenFromServerCookie } from '../../lib/auth';
import { fetcher } from '../../lib/api';

clodinary.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET,
  secure: true,


});

export const config = {

  api: {
    bodyParse: false
  }

}

export default async function upload(req, res) {
  if (req.method === 'POST') {

    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    const file = data?.files?.inputFile.filepath;
    const { user_id } = data.fields;
    try {

      const response = await clodinary.v2.uploader.upload(file, {
        public_id: user_id,
      });
      const { public_id } = response;
      const jwt = getTokenFromServerCookie(req);
      const userResponse = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${user_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            avatar: public_id,
          }),
        });
      const data = await userResponse.json();
      res.json({ message: 'success' });
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  } else {
    console.log("hata")
    return res.status(403).send('forbidden method');


  }

}





