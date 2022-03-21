const { gql } = require("apollo-server");
const axios = require("axios");
const Queue = require("bull");

const eqQueue = new Queue("feltEarthquakes", `redis://:${process.env.REDISPASSWORD}@${process.env.REDISENDPOINT}:${process.env.REDISPORT}`);

const typeDefs = gql`
  type earthQuake {
    date: String
    hour: String
    dateTime: String
    coordinates: String
    lintang: String
    bujur: String
    magnitude: Float
    depth: String
    area: String
    dirasakan: String
    potensi: String
    shakeMap: String
  }
  type Query {
    getEarthQuakes: [earthQuake]
    getRecentEarthquake: earthQuake
  }
`;

const baseUrl = "https://data.bmkg.go.id/DataMKG/TEWS/";

const resolvers = {
  Query: {
    getEarthQuakes: async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: baseUrl + "gempadirasakan.json",
        });
        let data = resp.data?.Infogempa.gempa;
        const result = data.map((e) => {
          let obj = {
            date: e.Tanggal,
            hour: e.Jam,
            dateTime: e.DateTime,
            coordinates: e.Coordinates,
            lintang: e.Lintang,
            bujur: e.Bujur,
            magnitude: +e.Magnitude,
            depth: e.Kedalaman,
            area: e.Wilayah,
            potensi: e.Potensi,
            dirasakan: e.Dirasakan,
            shakemap: e.Shakemap,
          };
          return obj;
        });
        return result;
      } catch (error) {
        // console.log(error);
        return error.response.data;
      }
    },

    getRecentEarthquake: async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: baseUrl + "autogempa.json",
        });
        const data = resp.data?.Infogempa.gempa;
        const result = {
          date: data.Tanggal,
          hour: data.Jam,
          dateTime: data.DateTime,
          coordinates: data.Coordinates,
          lintang: data.Lintang,
          bujur: data.Bujur,
          magnitude: +data.Magnitude,
          depth: data.Kedalaman,
          area: data.Wilayah,
          potensi: data.Potensi,
          dirasakan: data.Dirasakan,
          shakemap: data.Shakemap,
        };
        // const cacheItem = await redis.get("recentEarthquakes");
        // if (cacheItem) {
        //   const item = JSON.parse(cacheItem);
        //   // console.log(cacheItem);
        // }
        console.log(result);
        return result;
      } catch (error) {
        return error.response.data;
      }
    },
  },
};

// console.log(resolvers.Query.getEarthQuakes());
// resolvers.Query.getEarthQuakes.add()

eqQueue.process(async () => {
  return await resolvers.Query.getRecentEarthquake();
  // console.log(job, "masuk");
  // return await resolvers.Query.getEarthQuakes()
});
eqQueue.add(
  {},
  {
    repeat: {
      every: 60000,
      // limit: 10,
    },
  }
);

module.exports = {
  typeDefs,
  resolvers,
};
