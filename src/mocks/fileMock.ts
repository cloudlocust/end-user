// When you import image files, Jest tries to interpret the binary codes of the images as .js, hence runs into errors.
// The only way out is to mock a default response anytime jest sees an image import!
const fileMock = ''
export default fileMock
