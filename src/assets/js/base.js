/* global window document XMLHttpRequest */

const test = 123;

console.log(window.__ENV__, test);

// 测试
function get(url, fn) {
  const obj = new XMLHttpRequest();
  obj.open('GET', url, true);
  obj.onreadystatechange = () => {
    if ((obj.readyState === 4 && obj.status === 200) || obj.status === 304) {
      fn.call(this, obj.responseText);
    }
  };
  obj.send(null);
}
window.onload = () => {
  const $mockBtn = document.getElementById('js-mock-btn');
  const $rapBtn = document.getElementById('js-rap-btn');
  const $mockData = document.getElementById('js-mock-data');
  const $rapData = document.getElementById('js-rap-data');
  $mockBtn.onclick = () => {
    console.log('请求mock数据');
    get('/api/mock', (data) => {
      let text = '';
      try {
        text = JSON.stringify(data);
      } catch (e) {
        console.error(e);
      }
      $mockData.innerHTML = text;
    });
  };
  $rapBtn.onclick = () => {
    console.log('请求Rap数据');
    get('/api/rap/481/user/expert/checkV2', (data) => {
      let text = '';
      try {
        text = JSON.stringify(data);
      } catch (e) {
        console.error(e);
      }
      $rapData.innerHTML = text;
    });
  };
};
