import { Request, Response, Router } from "express";
import { db } from "../db/connection";
import { imageFilter, uploadStorage, uploader } from "../lib";
import { initModels } from "../models";
import { getUserData } from "../middlewares";
import { INewDeviceBody, INewDeviceImage } from "../interfaces/controllers";
import path from "path";
const Devices: Router = Router();
const {
  main_devices: MDevices,
} = initModels(db.conection);

const uploadFiles = uploader({
  storage: uploadStorage,
  ...imageFilter
});

Devices.get(`/`, [getUserData], (req: Request, res: Response) => {
  /*const mail = new Mail;
  mail.sendMail({
    to: "istjuanmolina@gmail.com",
    from: "andresfdel13@gmail.com",
    subject: "TEST"
  }, "", () => {
    console.log("Correo  enviado");
  });*/
  res.json({
    text: "Devices controller ready"
  })
});

Devices.post("/saveDevice", [getUserData, uploadFiles.single("image")], async (req: Request, res: Response) => {
  try {
    const data: INewDeviceBody = req.body;
    const user = req.actualUser;
    const file = req.file as INewDeviceImage;
    const device = await MDevices.create({
      owner_id: user.id,
      user_id: user.id,
      ...data,
      image: `/img/${path.basename(file.path)}`
    });

    return res.status(200).json({ text: "saved" });
  } catch (error: any) {
    console.error(error);
    return res.json({ text: error.message })
  }
});

export { Devices };