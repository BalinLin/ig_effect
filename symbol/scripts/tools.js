export function makesymbol(length) {
  let result = '';
  const characters = '~!@#$%^&*()_+-=[]{}';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
