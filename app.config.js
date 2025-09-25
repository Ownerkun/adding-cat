import "dotenv/config";

export default {
  expo: {
    name: "Adding Cat",
    slug: "adding-cat",
    extra: {
      eas: {
        projectId: "301a44b0-4edc-43fd-8c33-7029841c4107",
      },
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
    android: {
      package: "com.ownerkun.addingcat",
    },
  },
};
