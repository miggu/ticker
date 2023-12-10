export default function ticker(wrapperID, opts) {
  const defaultOptions = {
    uppercase: true,
    extra: ",.:+=/()-?",
    speed: 30,
    wait: 5500,
  };

  const options = { ...defaultOptions, ...opts };

  const alph = `01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ${
    !options.uppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase() : ""
  }${options.extra} `;

  const wrapper = document.getElementById(wrapperID);

  let k = 1;

  // len represents the longest length of any word, which will determine the final array length
  let len = 0;

  // HTMLCollection is not an array, more like arraylike
  const elems = Array.from(wrapper.children);

  const alphChars = alph.split("");

  // receives array wordChars, returns array filled with extra spaces
  function fill(wordChars) {
    while (wordChars.length < len) {
      wordChars.push(" ");
    }
    return wordChars;
  }

  const texts = elems.map((elem) => {
    const text = elem.textContent;
    len = Math.max(len, text.length);
    return options.uppercase ? text.toUpperCase() : text;
  });

  const target = document.createElement("div");

  // creates a succession of spans with charcters, requires an array to form a word with spans.
  function render(chars) {
    target.data = {};
    target.data.prev = chars.join("");

    fill(chars);

    const newChars = chars.map((char) => (char === " " ? "&#160;" : char));
    return `<span>${newChars.join("</span><span>")}</span>`;
  }

  console.log(texts);
  wrapper.innerHTML = render(texts[0].split(""));

  setInterval(() => {
    const nextWordChars = fill(texts[k].split(""));
    // ['✈', ' ', 'Z', 'X', 'Y', ' ', ' ', ' ', ' ', ' ', ' ', ' '] <= next would be the next word
    const prevWordChars = fill(target.data.prev.split(""));
    // ['✈', ' ', 'A', 'B', 'C', ' ', ' ', ' ', ' ', ' ', ' ', ' '] <= prev would be the prev word

    const chars = prevWordChars;

    nextWordChars.forEach((nextWordChar, i) => {
      if (nextWordChar === prevWordChars[i]) {
        return;
      }

      // index is the location where the char from the prevWord which is evaluated at hand
      let index = alph.indexOf(prevWordChars[i]);
      let j = 0;

      const step = () => {
        let isRequest = true;
        if (nextWordChar !== alphChars[index]) {
          // go to next char in the alphChars array, unless you reached the last in which case go to 0
          index = index === alphChars.length - 1 ? 0 : index + 1;
        } else {
          isRequest = false;
        }
        chars[i] = alphChars[index];
        wrapper.innerHTML = render(chars);
        isRequest && window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    });
    k = k == texts.length - 1 ? 0 : k + 1;
  }, options.wait);
}
