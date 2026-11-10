const serverErrorKeys = {
  'Not authorized, no token': 'noToken',
  'Not authorized, user not found': 'userNotFound',
  'User not found': 'userNotFound',
  'Not authorized, token failed': 'invalidToken',
  'Admin access required': 'adminRequired',
  'Name, a valid email, and password are required': 'missingRegistrationFields',
  'User already exists': 'accountExists',
  'An account with this email already exists': 'accountExists',
  'Server error': 'serverError',
  'A valid email and password are required': 'missingLoginFields',
  'Invalid email or password': 'invalidCredentials',
  'No file uploaded': 'missingFile',
  'Invalid file type. Only JPEG, PNG, and PDF are allowed.': 'invalidFileType',
  'Only PDF and image files can be converted to text': 'unsupportedFile',
  'No text could be found in this file': 'noTextFound',
  'Failed to extract text from image': 'imageOcrFailed',
  'Failed to extract text from PDF': 'pdfOcrFailed',
  'Failed to fetch history': 'historyFailed',
  'Password is required to delete your account': 'deletePasswordRequired',
  'Incorrect password': 'incorrectPassword',
  'Failed to export account data': 'accountExportFailed',
  'Failed to delete account': 'accountDeleteFailed',
  'Current and new passwords are required': 'passwordFieldsRequired',
  'New password must be different from the current password': 'passwordMustDiffer',
  'Incorrect current password': 'incorrectCurrentPassword',
  'Failed to update password': 'passwordUpdateFailed',
  'Failed to update settings': 'settingsUpdateFailed',
  'Preferred language must be English or Khmer': 'invalidPreferredLanguage',
  'Failed to load admin dashboard': 'adminDashboardFailed',
  'Failed to load system monitoring stats': 'monitoringLoadFailed',
  'Failed to load admin user list': 'userListLoadFailed',
  'Failed to update user role': 'adminRoleUpdateFailed',
  'Failed to delete user': 'adminDeleteFailed',
  'Failed to translate text': 'translationFailed',
  'Enter text to translate': 'translationTextRequired',
  'Text must be 5000 characters or fewer': 'translationTextTooLong',
  'Select two different supported languages': 'translationLanguagesInvalid'
};

export const localizeError = (message, t) => {
  const key = Object.hasOwn(serverErrorKeys, message) ? serverErrorKeys[message] : undefined;
  return key ? t(`errors.${key}`) : message;
};
