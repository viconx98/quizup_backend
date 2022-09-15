import yup from "yup"

export const signupValidations = yup.object().shape({
    name: yup.string()
        .min(3, "Username is too short at least 3 characters are required")
        .max(20, "Username is too long at only 20 characters are allowed")
        .required("username is required field"),

    email: yup.string()
        .email("Invalid email")
        .required("email is a required field"),

    password: yup.string()
        .min(6, "Password is too short at least 6 characters are required")
        .max(50, "Password is too long only 50 characters are allowed")
        .required("password is required field")
})

export const signinValidations = yup.object().shape({
    email: yup.string()
        .email("Invalid email")
        .required("email is a required field"),

    password: yup.string()
        .required("password is required field")
})

export const questionValidation = yup.object().shape({
    question: yup.string()
        .required("question is a required field"),

    questionType: yup.string()
        .required("questionType is a required field"),

    correctAnswer: yup.string()
        .required("correctAnswer is a required field"),

    options: yup.array()
        .max(4, "Invalid number of options")
        .min(4, "Invalid number of options")
        .required("options is a required field"),
})
