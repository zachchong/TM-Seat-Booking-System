const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    bookingForm: './src/bookingForm.js', 
    auth: './src/auth.js',
    myBookings: './src/myBookings.js',
    reset: './src/reset.js',
    index: './src/index.js',
    account: './src/account.js',
    feedback: './src/feedback.js'
  },//relative path
  output: {
    path: path.resolve(__dirname, 'dist'), //absolute path
    filename: '[name].bundle.js'
  },
  watch: true
}