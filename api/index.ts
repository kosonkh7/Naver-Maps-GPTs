const express = require("express");
const axios = require("axios"); // 웹사이트 자체에서 사용자가 서버한테 호출을 보내면, 그 호출을 받아서 실제로 돌려주고, 사용자에게 결과값을 알려주는데 도움이 되는 패키지
const app = express(); // express 를 활성화 해서 app을 활성화 하는 것

// 기본 홈페이지 경로를 호출하면, 다음 프린트문을 띄울 것이라고 express app에 알려주는 것
app.get("/", (req, res) => res.send("Express on Vercel")); 

// app.listen(3001, () => console.log("Server ready on port 3001.")); // 3001 포트로 바꾸니 성공

// /get-directions을 하면, 네이버 지도 API를 호출할 것이라고 알려주는 것
app.get("/get-directions", async (req, res) =>{ 
    const { start, goal, option } = req.query;

    console.log("Query parameters:", { start, goal, option });

    const url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving";

    const headers = {
        "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
    };

    console.log("Request URL:", url);
    console.log("Request headers:", headers);

    // 기본 홈페이지 경로를 호출하면, 다음 프린트문을 띄울 것이라고 express app에 알려주는 것
    try { 
        const response = await axios.get(url, {
        params: { start, goal, option },
        headers: headers,
        });

        console.log("Response status:", response.status);
        console.log("Response data: ", response.data);
        // console.log("Response data:", JSON.stringify(response.data, null, 2));

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
        console.error("Error response:", error.response.data);
        }
        res.status(error.response ? error.response.status : 500).json({
        error: error.message,
        details: error.response ? error.response.data : null,
        });
    }
    

})

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 0; // This will choose a random available port
  const server = app.listen(PORT, () =>
    console.log(`Server ready on port ${server.address().port}.`)
  );
}

module.exports = app;