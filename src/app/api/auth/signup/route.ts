import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  // se reciven los datos
  const { fullname, email, password } = await request.json();
  console.log(fullname, email, password);

  // comprovamos que la contraseña sea menor que 6
  if (!password || password.length < 6)
    return NextResponse.json(
      {
        message: "password debe ser al menos de 6 caracteres",
      },
      {
        status: 400,
      }
    );

  try {
    await connectDB();

    //si el usuario se busca por correo y se encuentra
    const userFound = await User.findOne({ email });

    // si existe retornamos un mensaje 409 y finaliza, ya no continua
    if (userFound)
      return NextResponse.json(
        {
          message: "email ya existe",
        },
        {
          status: 409,
        }
      );

    // encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // una ves encriptada la contraseña creamos un nuevo usuario y guardamos el email, fullname y la password sifrada
    const user = new User({
      email,
      fullname,
      password: hashedPassword,
    }); //genera un objeto usuario
    //Guardamos en la db
    const savedUser = await user.save();

    //retornamos el cli
    return NextResponse.json({
      _id: savedUser._id,
      email: savedUser.email,
      fullname: savedUser.fullname,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
