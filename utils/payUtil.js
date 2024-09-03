export const razorPayOptions = {
    "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    "currency": process.env.NEXT_PUBLIC_CURRENCY_TYPE,
    "name": process.env.NEXT_PUBLIC_PAY_APP_NAME,
    "description": "Test Transaction",
    "image": "/assets/images/icon/KFM_Logo_Small_Black.svg",
    "theme": {
        "color": "#144271"
    }
};
