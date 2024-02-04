import { StatusCodes } from "http-status-codes";
import cloudinary from "../config/cloudinary.js"; // Import the Cloudinary configuration
import Lawyer from "../models/Lawyer.js";

export const createLawyer = async (req, res, next) => {
  const { email, name, phone, yearOfExperience } = req.body;
  const profileImage = req.files.profileImage[0];
  const idCard = req.files.idCard[0];

  try {
    const profileImageResult = await cloudinary.uploader.upload(
      profileImage.path,
    );

    const idCardResult = await cloudinary.uploader.upload(idCard.path);

    const newLawyer = new Lawyer({
      email,
      name,
      phone,
      yearOfExperience,
      profileImage: profileImageResult.secure_url,
      idCard: idCardResult.secure_url,
      profileImagePublicId: profileImageResult.public_id,
      idCardPublicId: idCardResult.public_id,
    });

    const savedLawyer = await newLawyer.save();
    res.status(StatusCodes.OK).json(savedLawyer);
  } catch (err) {
    next(err);
  }
};

export const deleteLawyer = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Lawyer not found." });
    }

    await cloudinary.uploader.destroy(lawyer.profileImagePublicId);
    await cloudinary.uploader.destroy(lawyer.idCardPublicId);
    await lawyer.remove();

    res.status(StatusCodes.OK).json({ message: "Lawyer has been deleted." });
  } catch (err) {
    next(err);
  }
};

export const getLawyer = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Lawyer not found." });
    }

    const profileImage = await cloudinary.url(lawyer.profileImage, {
      secure: true,
    });
    const idCard = await cloudinary.url(lawyer.idCard, { secure: true });

    const lawyerWithImages = {
      ...lawyer._doc,
      profileImage,
      idCard,
    };

    res.status(StatusCodes.OK).json(lawyerWithImages);
  } catch (err) {
    next(err);
  }
};

export const getLawyers = async (req, res, _) => {
  const { city } = req.query;

  try {
    let query = Lawyer.find();

    if (city) {
      query = query.where({ city });
    }

    const lawyers = await query.exec();

    if (lawyers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No lawyers found." });
    }

    const lawyersWithImages = await Promise.all(
      lawyers.map(async (lawyer) => {
        const profileImage = await cloudinary.url(lawyer.profileImagePublicId, {
          secure: true,
        });
        const idCard = await cloudinary.url(lawyer.idCardPublicId, {
          secure: true,
        });

        return {
          ...lawyer._doc,
          profileImage,
          idCard,
        };
      }),
    );

    res.status(StatusCodes.OK).json(lawyersWithImages);
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred" });
  }
};
