import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isPasswordValid(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            select: false,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, documentRecord) => {
                const { password, __v, ...safeUserData } = documentRecord;
                return safeUserData;
            },
        },
    }
);

UserSchema.pre("save", async function hashPasswordBeforeSave() {
    if (!this.isModified("password")) {
        return;
    }

    const saltRounds = 12;
    const generatedSalt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(this.password, generatedSalt);
    
    this.password = hashedPassword;
});

UserSchema.methods.isPasswordValid = async function (
    this: UserDocument,
    candidatePassword: string
): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (comparisonError) {
        console.error("Password comparison failed:", comparisonError);
        return false;
    }
};

const UserModel: Model<UserDocument> = 
    mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default UserModel;