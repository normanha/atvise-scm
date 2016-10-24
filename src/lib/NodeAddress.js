const ExtensionFromVariableType = 0;

const ExtensionForDataType = {
  ByteString: ExtensionFromVariableType,
  XmlElement: 'xml',
  Boolean: 'bool',
};

const ExtensionForVariableType = {
  'VariableTypes.ATVISE.HtmlHelp': 'html',
};

export default class NodeAddress {
  static toFilePath(referenceDescription, dataTypeReference) {
    const typeDef = referenceDescription.typeDefinition.value;
    const nodePath = referenceDescription.nodeId.value;
    const dataType = dataTypeReference.key;

    // Get extension
    // If the dataType has his own extension, use it
    // Else if the variableType has his own extension, use it
    // Otherwise use the extension from the nodeId
    const extType = ExtensionForDataType[dataType];
    let extension = extType === undefined ?
      dataType.toLowerCase() : extType;

    if (extension === ExtensionFromVariableType) {
      const ext = ExtensionForVariableType[typeDef];
      if (ext) {
        extension = ext;
      } else {
        extension = false; // Use extension from node path
      }
    }

    // Create file path
    // node paths are joined by a '.' char
    // The only exception are Resource paths, where everything after the 'RESOURCES' component
    // is joined by '/'
    const parts = nodePath.split('RESOURCES');

    // TODO: Embed in folder if needed

    parts[0] = parts[0].replace(/\./g, '/');

    const result = parts.join('RESOURCES');
    if (extension !== false) {
      return `${result}.${extension}`;
    }

    return result;
  }
}
