const config = {
  secretKey: '$SECRET_KEY',
  port: '$PORT',
  dataDir: '$DATA_DIR',
  loopInterval: '$LOOP_INTERVAL',
  backendSync: {
    enabled: '$BACKEND_ENABLED',
    baseUrl: '$BACKEND_API',
    nodeRefreshIntervalSeconds: '$NODE_REFRESH_INTERVAL_SEC',
    pointRefreshIntervalSeconds: '$POINT_REFRESH_INTERVAL_SEC',
    nodeDistance: '$NODE_DISTANCE',
  },
};

export default config;
