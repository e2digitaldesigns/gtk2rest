import { connect } from "mongoose";

const localConnection = `mongodb://127.0.0.1:27017/overlays?readPreference=primary&directConnection=true&ssl=false`;

const remoteConnection = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@overlaycluster.t4locfu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const uri = process.env.NODE_ENV === "production" ? remoteConnection : localConnection;

export const initializeMongo = async () => {
  try {
    await connect(uri, {}).then(
      () => {
        console.log("Mongo initialization successful");
      },
      err => {
        console.error(err);
      }
    );
  } catch (error) {
    console.error("Mongo initialization failed:", error);
    process.exit(1);
  }
};
