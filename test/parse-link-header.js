import tape from 'tape'
import { parseLinkHeader as parse } from '../index.js'

const test = tape.test

test('parsing a proper link header with next and last', function (t) {
  const link =
    '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100>; rel="next", ' +
    '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100>; rel="last"'

  t.deepEqual(
    parse(link)
    , {
      next:
        {
          client_id: '1',
          client_secret: '2',
          page: '2',
          per_page: '100',
          rel: 'next',
          url: 'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100'
        },
      last:
        {
          client_id: '1',
          client_secret: '2',
          page: '3',
          per_page: '100',
          rel: 'last',
          url: 'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100'
        }
    }
    , 'parses out link, page and perPage for next and last'
  )
  t.end()
})

test('parsing a link header with relative links', function (t) {
  const link =
    '</user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100>; rel="next", ' +
    '</user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100>; rel="last"'

  t.deepEqual(
    parse(link)
    , {
      next:
        {
          client_id: '1',
          client_secret: '2',
          page: '2',
          per_page: '100',
          rel: 'next',
          url: '/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100'
        },
      last:
        {
          client_id: '1',
          client_secret: '2',
          page: '3',
          per_page: '100',
          rel: 'last',
          url: '/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100'
        }
    }
    , 'parses out link, page and perPage for next and last'
  )
  t.end()
})

test('handles unquoted relationships', function (t) {
  const link =
    '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100>; rel=next, ' +
    '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100>; rel=last'

  t.deepEqual(
    parse(link)
    , {
      next:
        {
          client_id: '1',
          client_secret: '2',
          page: '2',
          per_page: '100',
          rel: 'next',
          url: 'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100'
        },
      last:
        {
          client_id: '1',
          client_secret: '2',
          page: '3',
          per_page: '100',
          rel: 'last',
          url: 'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100'
        }
    }
    , 'parses out link, page and perPage for next and last'
  )
  t.end()
})

test('parsing a proper link header with next, prev and last', function (t) {
  const linkHeader =
    '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", ' +
    '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="prev", ' +
    '<https://api.github.com/user/9287/repos?page=5&per_page=100>; rel="last"'

  t.deepEqual(
    parse(linkHeader)
    , {
      next:
        {
          page: '3',
          per_page: '100',
          rel: 'next',
          url: 'https://api.github.com/user/9287/repos?page=3&per_page=100'
        },
      prev:
        {
          page: '1',
          per_page: '100',
          rel: 'prev',
          url: 'https://api.github.com/user/9287/repos?page=1&per_page=100'
        },
      last:
        {
          page: '5',
          per_page: '100',
          rel: 'last',
          url: 'https://api.github.com/user/9287/repos?page=5&per_page=100'
        }
    }
    , 'parses out link, page and perPage for next, prev and last'
  )
  t.end()
})

test('parsing an empty link header', function (t) {
  const linkHeader = ''
  t.equal(parse(linkHeader), null, 'returns null')
  t.end()
})

test('parsing a proper link header with next and a link without rel', function (t) {
  const linkHeader =
    '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", ' +
    '<https://api.github.com/user/9287/repos?page=1&per_page=100>; pet="cat", '

  t.deepEqual(
    parse(linkHeader)
    , {
      next:
        {
          page: '3',
          per_page: '100',
          rel: 'next',
          url: 'https://api.github.com/user/9287/repos?page=3&per_page=100'
        }
    }
    , 'parses out link, page and perPage for next only'
  )
  t.end()
})

test('parsing a proper link header with next and properties besides rel', function (t) {
  const linkHeader =
    '<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next"; hello="world"; pet="cat"'

  t.deepEqual(
    parse(linkHeader)
    , {
      next:
        {
          page: '3',
          per_page: '100',
          rel: 'next',
          hello: 'world',
          pet: 'cat',
          url: 'https://api.github.com/user/9287/repos?page=3&per_page=100'
        }
    }
    , 'parses out link, page and perPage for next and all other properties'
  )
  t.end()
})

test('parsing a proper link header with a comma in the url', function (t) {
  const linkHeader =
    '<https://imaginary.url.notreal/?name=What,+me+worry>; rel="next";'

  t.deepEqual(
    parse(linkHeader)
    , {
      next:
        {
          rel: 'next',
          name: 'What, me worry',
          url: 'https://imaginary.url.notreal/?name=What,+me+worry'
        }
    }
    , 'correctly parses URL with comma'
  )
  t.end()
})

test('parsing a proper link header with a multi-word rel', function (t) {
  const linkHeader =
    '<https://imaginary.url.notreal/?name=What,+me+worry>; rel="next page";'

  t.deepEqual(
    parse(linkHeader)
    , {
      page: {
        rel: 'page',
        name: 'What, me worry',
        url: 'https://imaginary.url.notreal/?name=What,+me+worry'
      },
      next: {
        rel: 'next',
        name: 'What, me worry',
        url: 'https://imaginary.url.notreal/?name=What,+me+worry'
      }
    }
    , 'correctly parses multi-word rels'
  )
  t.end()
})

test('parsing a proper link header with matrix parameters', function (t) {
  const linkHeader =
    '<https://imaginary.url.notreal/segment;foo=bar;baz/item?name=What,+me+worry>; rel="next";'

  t.deepEqual(
    parse(linkHeader)
    , {
      next: {
        rel: 'next',
        name: 'What, me worry',
        url: 'https://imaginary.url.notreal/segment;foo=bar;baz/item?name=What,+me+worry'
      }
    }
    , 'correctly parses url with matrix parameters'
  )
  t.end()
})

test('parsing an extremely long link header', function (t) {
  const linkHeader = '; rel="' + Array(10000).join(' ') + '",'

  t.equal(
    parse(linkHeader)
    , null
    , 'correctly returns null when dealing with an extremely long link header'
  )
  t.end()
})

test('parsing a long link header with configured max length', function (t) {
  const maxHeaderLength = 5
  const linkHeader = '; rel="' + Array(maxHeaderLength).join(' ') + '",'

  t.equal(
    parse(linkHeader, { maxHeaderLength })
    , null
    , `correctly returns null when parsing a header with > ${maxHeaderLength} characters`
  )
  t.end()
})

test('parsing a long link header throws when max length exceeded', function (t) {
  const maxHeaderLength = 5
  const linkHeader = '; rel="' + Array(maxHeaderLength).join(' ') + '",'

  t.throws(
    () => parse(linkHeader, { maxHeaderLength, throwOnMaxHeaderLengthExceeded: true })
  )
  t.end()
})
