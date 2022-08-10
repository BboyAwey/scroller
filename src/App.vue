<script setup lang="ts">
import { onMounted } from 'vue'
import Scroller, { ScrollDirection } from '../scroller'

var s1: Scroller, s2: Scroller
function __test (s: 0 | 1) {
  if (s) document.getElementById('container')!.style.padding = '100px'
  else document.getElementById('container')!.style.padding = '60px'
}
function destroy () {
  s1.destroy()
}
function getScroll () {
  const res = s1.getScroll()
  document.getElementById('scrollValue')!.innerText = `scrollTop: ${res.scrollTop}, scrollLeft: ${res.scrollLeft}`
}
function scrollHandler (e: Event) {
  document.getElementById('listenerValue')!.innerText = `scrollTop: ${(e.target as HTMLElement).scrollTop}, scrollLeft: ${(e.target as HTMLElement).scrollLeft}`
}
function addScrollListener () {
  s1.onScroll(scrollHandler)
}
function removeScrollListener () {
  s1.offScroll(scrollHandler)
}

function topChange(e: Event) {
  if (e.target && (e.target as HTMLInputElement).value) {
    s1.scrollTo({ scrollTop: Number((e.target as HTMLInputElement).value) })
  }
}

function leftChange(e: Event) {
  if (e.target && (e.target as HTMLInputElement).value) {
    s1.scrollTo({ scrollLeft: Number((e.target as HTMLInputElement).value) })
  }
}


function insertSth () {
  const div = document.createElement('div')
  div.style.width = '600px'
  div.style.height = '600px'
  div.style.backgroundColor = '#f63'
  document.getElementById('container')!.appendChild(div)
}

function setDirection (d: ScrollDirection) { s1.setDirection(d) }

function show () {
  document.getElementById('container')!.style.display = 'block'
}
function hide () {
  document.getElementById('container')!.style.display = 'none'
}

onMounted(() => {
  s1 = new Scroller({
    el: document.getElementById('container'),
    direction: 'both',
    offset: 2
  })
  s2 = new Scroller({
    el: document.getElementById('container2'),
    trackClassName: 'track',
    barClassName: 'bar',
  })
})
</script>

<template>
  <button @click="() => __test(1)">large</button>
  <button @click="() => __test(0)">small</button><br/><br/>

  <button @click="() => getScroll()">Get Scroll values</button>
  <span id="scrollValue">--</span><br/><br/>

  <button @click="() => addScrollListener()">Add a scroll listener</button>
  <button @click="() => removeScrollListener()">remove that scroll listener</button>
  <span id="listenerValue">--</span><br/><br/>

  <button @click="() => insertSth()">insert some DOM</button><br/><br/>
  <button @click="()=> destroy()">Destroy</button><br/><br/>

  <button @click="()=> setDirection('vertical')">Vertical</button>
  <button @click="()=> setDirection('horizontal')">Horizontal</button>
  <button @click="()=> setDirection('both')">Both</button>
  <button @click="()=> setDirection('none')">None</button><br/><br/>

  <button @click="()=> show()">Show</button><br/><br/>
  <button @click="()=> hide()">Hide</button><br/><br/>


  <label>
    scrollTop: <input @input="evt => topChange(evt)" type="number"/>
  </label><br><br>
  <label>
    scrollLeft: <input @input="evt => leftChange(evt)" type="number"/>
  </label>
  <div id="container">
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit molestias amet laborum incidunt minima. Fuga, necessitatibus dicta ex praesentium dolore odit delectus dolorum nesciunt? Libero fugiat officia voluptates eos saepe?</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quisquam eaque? Magnam iure quaerat dolores a, dicta quas at soluta inventore esse dolorum cupiditate. Ex voluptas ducimus est dolorem error.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat sequi, nam hic tempora commodi illum dolore sint. Optio facere fuga saepe amet cupiditate porro excepturi ab perferendis, molestiae dolores!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa aliquam similique corrupti quidem, assumenda pariatur repudiandae dolorem dolore excepturi, ut ab ducimus dicta quaerat harum voluptatum! Suscipit eum nesciunt accusantium.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam officiis quas doloremque distinctio reprehenderit voluptatum quia, repudiandae eveniet, vel maiores aut sint minus, nesciunt numquam recusandae. Et error placeat commodi.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ut voluptate nobis laborum nisi? Deserunt iusto sequi, hic repellendus, mollitia dolor illo officiis maiores, quam aliquam dolorem illum quibusdam quae.</p>
      <div id="container2">
        <div style="width: 600px">
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit molestias amet laborum incidunt minima. Fuga, necessitatibus dicta ex praesentium dolore odit delectus dolorum nesciunt? Libero fugiat officia voluptates eos saepe?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quisquam eaque? Magnam iure quaerat dolores a, dicta quas at soluta inventore esse dolorum cupiditate. Ex voluptas ducimus est dolorem error.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat sequi, nam hic tempora commodi illum dolore sint. Optio facere fuga saepe amet cupiditate porro excepturi ab perferendis, molestiae dolores!</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa aliquam similique corrupti quidem, assumenda pariatur repudiandae dolorem dolore excepturi, ut ab ducimus dicta quaerat harum voluptatum! Suscipit eum nesciunt accusantium.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam officiis quas doloremque distinctio reprehenderit voluptatum quia, repudiandae eveniet, vel maiores aut sint minus, nesciunt numquam recusandae. Et error placeat commodi.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ut voluptate nobis laborum nisi? Deserunt iusto sequi, hic repellendus, mollitia dolor illo officiis maiores, quam aliquam dolorem illum quibusdam quae.</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit molestias amet laborum incidunt minima. Fuga, necessitatibus dicta ex praesentium dolore odit delectus dolorum nesciunt? Libero fugiat officia voluptates eos saepe?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quisquam eaque? Magnam iure quaerat dolores a, dicta quas at soluta inventore esse dolorum cupiditate. Ex voluptas ducimus est dolorem error.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat sequi, nam hic tempora commodi illum dolore sint. Optio facere fuga saepe amet cupiditate porro excepturi ab perferendis, molestiae dolores!</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa aliquam similique corrupti quidem, assumenda pariatur repudiandae dolorem dolore excepturi, ut ab ducimus dicta quaerat harum voluptatum! Suscipit eum nesciunt accusantium.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam officiis quas doloremque distinctio reprehenderit voluptatum quia, repudiandae eveniet, vel maiores aut sint minus, nesciunt numquam recusandae. Et error placeat commodi.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ut voluptate nobis laborum nisi? Deserunt iusto sequi, hic repellendus, mollitia dolor illo officiis maiores, quam aliquam dolorem illum quibusdam quae.</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit molestias amet laborum incidunt minima. Fuga, necessitatibus dicta ex praesentium dolore odit delectus dolorum nesciunt? Libero fugiat officia voluptates eos saepe?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quisquam eaque? Magnam iure quaerat dolores a, dicta quas at soluta inventore esse dolorum cupiditate. Ex voluptas ducimus est dolorem error.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat sequi, nam hic tempora commodi illum dolore sint. Optio facere fuga saepe amet cupiditate porro excepturi ab perferendis, molestiae dolores!</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa aliquam similique corrupti quidem, assumenda pariatur repudiandae dolorem dolore excepturi, ut ab ducimus dicta quaerat harum voluptatum! Suscipit eum nesciunt accusantium.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam officiis quas doloremque distinctio reprehenderit voluptatum quia, repudiandae eveniet, vel maiores aut sint minus, nesciunt numquam recusandae. Et error placeat commodi.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ut voluptate nobis laborum nisi? Deserunt iusto sequi, hic repellendus, mollitia dolor illo officiis maiores, quam aliquam dolorem illum quibusdam quae.</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit molestias amet laborum incidunt minima. Fuga, necessitatibus dicta ex praesentium dolore odit delectus dolorum nesciunt? Libero fugiat officia voluptates eos saepe?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quisquam eaque? Magnam iure quaerat dolores a, dicta quas at soluta inventore esse dolorum cupiditate. Ex voluptas ducimus est dolorem error.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat sequi, nam hic tempora commodi illum dolore sint. Optio facere fuga saepe amet cupiditate porro excepturi ab perferendis, molestiae dolores!</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa aliquam similique corrupti quidem, assumenda pariatur repudiandae dolorem dolore excepturi, ut ab ducimus dicta quaerat harum voluptatum! Suscipit eum nesciunt accusantium.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam officiis quas doloremque distinctio reprehenderit voluptatum quia, repudiandae eveniet, vel maiores aut sint minus, nesciunt numquam recusandae. Et error placeat commodi.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ut voluptate nobis laborum nisi? Deserunt iusto sequi, hic repellendus, mollitia dolor illo officiis maiores, quam aliquam dolorem illum quibusdam quae.</p>
        </div>
      </div>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit molestias amet laborum incidunt minima. Fuga, necessitatibus dicta ex praesentium dolore odit delectus dolorum nesciunt? Libero fugiat officia voluptates eos saepe?</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quisquam eaque? Magnam iure quaerat dolores a, dicta quas at soluta inventore esse dolorum cupiditate. Ex voluptas ducimus est dolorem error.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat sequi, nam hic tempora commodi illum dolore sint. Optio facere fuga saepe amet cupiditate porro excepturi ab perferendis, molestiae dolores!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa aliquam similique corrupti quidem, assumenda pariatur repudiandae dolorem dolore excepturi, ut ab ducimus dicta quaerat harum voluptatum! Suscipit eum nesciunt accusantium.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam officiis quas doloremque distinctio reprehenderit voluptatum quia, repudiandae eveniet, vel maiores aut sint minus, nesciunt numquam recusandae. Et error placeat commodi.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ut voluptate nobis laborum nisi? Deserunt iusto sequi, hic repellendus, mollitia dolor illo officiis maiores, quam aliquam dolorem illum quibusdam quae.</p>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit molestias amet laborum incidunt minima. Fuga, necessitatibus dicta ex praesentium dolore odit delectus dolorum nesciunt? Libero fugiat officia voluptates eos saepe?</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quisquam eaque? Magnam iure quaerat dolores a, dicta quas at soluta inventore esse dolorum cupiditate. Ex voluptas ducimus est dolorem error.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat sequi, nam hic tempora commodi illum dolore sint. Optio facere fuga saepe amet cupiditate porro excepturi ab perferendis, molestiae dolores!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa aliquam similique corrupti quidem, assumenda pariatur repudiandae dolorem dolore excepturi, ut ab ducimus dicta quaerat harum voluptatum! Suscipit eum nesciunt accusantium.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam officiis quas doloremque distinctio reprehenderit voluptatum quia, repudiandae eveniet, vel maiores aut sint minus, nesciunt numquam recusandae. Et error placeat commodi.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ut voluptate nobis laborum nisi? Deserunt iusto sequi, hic repellendus, mollitia dolor illo officiis maiores, quam aliquam dolorem illum quibusdam quae.</p>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit molestias amet laborum incidunt minima. Fuga, necessitatibus dicta ex praesentium dolore odit delectus dolorum nesciunt? Libero fugiat officia voluptates eos saepe?</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, quisquam eaque? Magnam iure quaerat dolores a, dicta quas at soluta inventore esse dolorum cupiditate. Ex voluptas ducimus est dolorem error.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat sequi, nam hic tempora commodi illum dolore sint. Optio facere fuga saepe amet cupiditate porro excepturi ab perferendis, molestiae dolores!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa aliquam similique corrupti quidem, assumenda pariatur repudiandae dolorem dolore excepturi, ut ab ducimus dicta quaerat harum voluptatum! Suscipit eum nesciunt accusantium.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam officiis quas doloremque distinctio reprehenderit voluptatum quia, repudiandae eveniet, vel maiores aut sint minus, nesciunt numquam recusandae. Et error placeat commodi.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ut voluptate nobis laborum nisi? Deserunt iusto sequi, hic repellendus, mollitia dolor illo officiis maiores, quam aliquam dolorem illum quibusdam quae.</p>
  </div>
</template>

<style>
body {
  padding: 40px;
}
#container,
#container2
{
  width: 25%;
  height: 400px;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 30px;
  padding-left: 40px;
  margin: 50px;
  border: 1px solid #f63;
  border-radius: 5px;
}

#container {
  /* display: none */
}
#container p {
  margin: 0;
}
.track {
  background: lightpink;
}
.bar {
  background: darkslategrey;
}
</style>
