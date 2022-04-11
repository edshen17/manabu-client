import { IpregistryClient } from '@ipregistry/client';

const ipClient = new IpregistryClient(process.env.VUE_APP_IP_REGISTRY_TOKEN!);

export { ipClient };
