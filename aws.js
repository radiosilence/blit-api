import config from 'config';
import AWS from 'aws-sdk';

const AWSConfig = config.get('aws');

AWS.config.update({
  accessKeyId: AWSConfig.accessKeyId,
  secretAccessKey: AWSConfig.secretAccessKey
});


export default AWS;