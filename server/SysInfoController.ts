import { Request, Response } from 'express';

import * as si from 'systeminformation';

async function getSysInfo(type: string, target: string): Promise<object | string> {
  switch (type) {
    case "cpu": {
      const data = await si.cpu();
      const cpuData = JSON.parse(JSON.stringify(data));
      return cpuData;
    }
    case "mem": {
      const data = await si.mem();
      const memData = JSON.parse(JSON.stringify(data));
      return memData;
    }
    default:
      return "Invalid type";
  }

}

export class SysInfoController {


  async watchItem(req: Request, res: Response) {

    const params = req.query;
    const type = params.type?.toString() ?? "";
    const target = params.target?.toString() ?? "";
    const interval = parseFloat(params.interval?.toString() ?? "1000");

    if (type === "" || isNaN(interval) || interval < 100) {
      res.status(400).send("Invalid request");
      return;
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    const intervalId = setInterval(() => {
      // res.write(`data: ${JSON.stringify({ message: 'Hello World!' })}\n\n`);
      // @ts-ignore
      getSysInfo(type, target).then(data => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      });


    }, interval);


    res.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });


  };


}
