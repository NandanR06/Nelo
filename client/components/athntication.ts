import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Save tokens
export async function saveTokens(accessToken :any, refreshToken :any) {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (e) {
    console.error("Error saving tokens", e);
  }
}

// Get access token
export async function getAccessToken() {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (e) {
    console.error("Error getting access token", e);
    return null;
  }
}

// Get refresh token
export async function getRefreshToken() {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (e) {
    console.error("Error getting refresh token", e);
    return null;
  }
}

// Remove tokens (logout)
export async function clearTokens() {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (e) {
    console.error("Error clearing tokens", e);
  }
}
