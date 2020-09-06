// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const doubanbook = require('doubanbook')
const cheerio = require('cheerio')

cloud.init()

async function searchBook(isbn) {
  console.log("-->", isbn)
  let url = "https://search.douban.com/book/subject_search?search_text=" + isbn
  let searchInfo = await axios.get(url)
  let reg = /window\.__DATA__ = "(.*)"/
  if (reg.test(searchInfo.data)) {
    let bookData = doubanbook(RegExp.$1)[0]
    console.log("-->", bookData)
    console.log(bookData.title, bookData.rating, bookData.url)
    return await getDouBanBookInfo(bookData)
  }
  return null
}

async function getDouBanBookInfo(bookData) {
  let doubanbookInfo = await axios.get(bookData.url)
  // console.log("-->", doubanbookInfo.data)
  const $ = cheerio.load(doubanbookInfo.data)
  // 去除换行  空格  过滤空值
  let info = $("#info").text().split('\n').map(v => v.trim()).filter(v => v)
  // console.log("-->", info)
  const auther = info[1]
  const tags = []
  $("#db-tags-section a.tag").each((k, v) => {
    tags.push($(v).text())
  })
  const res = {
    createTime: new Date().getTime(),
    title: bookData.title,
    rating: bookData.rating["star_count"] / bookData.rating["value"],
    image: bookData.cover_url,
    tags: tags,
    summary:$("#link-report .intro").text(),
    auther: auther
  }
  console.log("-->", res)
  return res
}

// console.log(searchBook(9787040432022))
// 云函数入口函数
exports.main = async (event, context) => {
  // 解包  客户端要key:value形式调用
  const { isbn } = event
  return searchBook(isbn)
}