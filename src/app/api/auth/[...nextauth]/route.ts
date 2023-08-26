import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // El nombre que se mostrará en el formulario de inicio de sesión (por ejemplo, "Iniciar sesión con...")
      name: "Credentials",
      // `credentials` se utiliza para generar un formulario en la página de inicio de sesión.
      // Puede especificar qué campos deben enviarse agregando claves al objeto `credenciales`.
      // p.ej. dominio, nombre de usuario, contraseña, token 2FA, etc.
      // Puedes pasar cualquier atributo HTML a la etiqueta <input> a través del objeto.
      credentials: {
        email: { label: "Username", type: "email", placeholder: "jsmith" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, req) {
        // Agregue lógica aquí para buscar el usuario a partir de las credenciales proporcionadas.
        await connectDB();
        console.log(credentials);

        // comparando email
        const userFound = await User.findOne({
          email: credentials?.email,
        }).select("+password");
        // si no existe
        if (!userFound) throw new Error("Credenciales invalidas");
        console.log(userFound);

        // comparando password
        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );
        // si no existe
        if (!passwordMatch) throw new Error("Credenciales invalidas");

        return userFound;
      },
    }),
  ],
  callbacks: {
    jwt({ account, token, user, profile, session }) {
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      session.user = token.user as any;

      return session;
    },
  },
  pages: {
    signIn: '/login'
  }
});

export { handler as GET, handler as POST };
