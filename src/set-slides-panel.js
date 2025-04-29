// This script changes the active panel to 'slides' to access the slide editor
(() => {
  // Access the app's React instance
  const appRoot = document.querySelector('#root');
  if (!appRoot) {
    console.error('Could not find React root element');
    return;
  }
  
  // Find the React instance key
  const reactKey = Object.keys(appRoot).find(key => key.startsWith('__reactContainer'));
  if (!reactKey) {
    console.error('Could not find React container key');
    return;
  }
  
  // Get the React fiber node
  const fiberNode = appRoot[reactKey];
  if (!fiberNode) {
    console.error('Could not access fiber node');
    return;
  }

  // Function to search for the AppContext provider in the React component tree
  function findContextProvider(node, contextName = 'AppContext') {
    if (!node) return null;
    
    // Check if this node has a context provider
    if (
      node.memoizedProps && 
      node.type && 
      node.type.displayName && 
      node.type.displayName.includes(contextName)
    ) {
      return node;
    }
    
    // Check child
    if (node.child) {
      const result = findContextProvider(node.child, contextName);
      if (result) return result;
    }
    
    // Check sibling
    if (node.sibling) {
      const result = findContextProvider(node.sibling, contextName);
      if (result) return result;
    }
    
    return null;
  }
  
  // Find the AppContext provider
  const providerNode = findContextProvider(fiberNode.current);
  if (!providerNode) {
    console.error('Could not find AppContext provider');
    return;
  }
  
  // Access the dispatch function
  const dispatch = providerNode.memoizedProps.value.dispatch;
  if (!dispatch) {
    console.error('Could not access dispatch function');
    return;
  }
  
  // Set the active panel to 'slides'
  dispatch({
    type: 'SET_ACTIVE_PANEL',
    panel: 'slides',
  });
  
  console.log('Successfully set active panel to slides');
})();
