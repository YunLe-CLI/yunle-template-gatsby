/* global window document XMLHttpRequest */
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
    get('/mockjsdata/481/tenant/service-package/1', (data) => {
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
