import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, username, locale = "id" } = await request.json();

    if (!email || !username) {
      return NextResponse.json(
        { error: locale === "en" ? "Missing email or username" : "Email atau username harus diisi" },
        { status: 400 }
      );
    }

    // Find user with matching email and username (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        name: { equals: username, mode: "insensitive" },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            locale === "en"
              ? "No user found with the provided email and username"
              : "User dengan email dan username tersebut tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Generate reset token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    // Save to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Create reset URL
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const resetUrl = `${origin}/${locale}/reset-password?token=${resetToken}`;

    console.log(`[PASSWORD RESET LINK for ${user.email}]: ${resetUrl}`);

    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"L.A Group" <noreply@lagroupofficial.com>`;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost || "smtp.gmail.com",
          port: parseInt(smtpPort || "587"),
          secure: smtpPort === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const subject = locale === "en" ? "Reset Your Password - L.A Group" : "Atur Ulang Kata Sandi - L.A Group";
        
        const emailHtml = locale === "en" ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px; background-color: #002b5b; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0;">L.A Group</h1>
            </div>
            <p>Hello, <strong>${user.name}</strong></p>
            <p>We received a request to reset the password for your account. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #f9c51a; color: #1a2b4b; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 197, 26, 0.2);">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
            <p style="color: #ef4444; font-size: 14px;">This link will expire in 1 hour.</p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999999; text-align: center;">If you did not request a password reset, please ignore this email.</p>
          </div>
        ` : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px; background-color: #002b5b; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0;">L.A Group</h1>
            </div>
            <p>Halo, <strong>${user.name}</strong></p>
            <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Klik tombol di bawah ini untuk membuat kata sandi baru:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #f9c51a; color: #1a2b4b; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 197, 26, 0.2);">Reset Password</a>
            </div>
            <p>Atau salin dan tempel link berikut ke browser Anda:</p>
            <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
            <p style="color: #ef4444; font-size: 14px;">Link ini akan kedaluwarsa dalam 1 jam.</p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999999; text-align: center;">Jika Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini.</p>
          </div>
        `;

        await transporter.sendMail({
          from: smtpFrom,
          to: user.email,
          subject,
          html: emailHtml,
        });
      } catch (mailError) {
        console.error("SMTP sending failed, falling back to console logging:", mailError);
        console.log(`[SMTP FALLBACK RESET LINK for ${user.email}]: ${resetUrl}`);
      }
    } else {
      console.warn("SMTP credentials are not configured. Sent reset link to console log.");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: `Forgot password error: ${error?.message || error}` }, { status: 500 });
  }
}
