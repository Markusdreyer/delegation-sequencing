import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.enable("trust proxy");
app.use(cors());
const port = 8000;

interface TableData {
  action: string;
  agents: string;
  quantity: number;
  abbreviation: string;
  precedence: string;
}

app.post("/asp-parser", (req, res) => {
  const tableData: TableData[] = req.body;
  let aspString = "";
  tableData.map((el) => {
    const precedence = el.precedence;
    const agents = el.agents.split(",");
    if (agents.length > 1) {
      aspString = aspString.concat(`collaborative(${precedence})`);
    } else {
      aspString = aspString.concat(`primitive(${precedence})`);
    }
    aspString = aspString.concat(
      `description(${precedence}, ${el.action}) delegate(${precedence}, ${el.quantity}, ${agents}):-deploy(${precedence}) mandatory(${precedence})`
    );
  });

  res.json(aspString);
});

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
