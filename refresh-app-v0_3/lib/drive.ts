
import { google } from 'googleapis';

export function getDrive() {
  if (!process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON) throw new Error('Missing GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON');
  const creds = JSON.parse(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON);
  const scopes = ['https://www.googleapis.com/auth/drive.file'];
  const auth = new google.auth.JWT(creds.client_email, undefined, creds.private_key, scopes);
  return google.drive({ version: 'v3', auth });
}
