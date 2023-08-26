import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email es requerido"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ],
  },
  password: {
    type: String,
    required: [true, "Password es requerido"],
    select: false,
  },
  fullname: {
    type: String,
    required: [true, "fullname es requerido"],
    minLength: [3, "fullname mínimo 3 caracteres"],
    maxLength: [20, "fullname maximo 20 caracteres"],
  },
});

const User = models.User || model('User', userSchema)
export default User;