import DisplayTransformer from '../transformers/DisplayTransformer';

export const useTransformers = [
  new DisplayTransformer(),
];

export const nodes = [
  'ns=1;s=AGENT',
  'ns=1;s=SYSTEM',
];

export const host = 'localhost';
export const port = {
  opc: 4840,
  http: 80,
};
