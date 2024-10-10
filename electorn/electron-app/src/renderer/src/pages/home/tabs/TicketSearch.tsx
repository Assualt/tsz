import SearchBox from '../components/SearchBox'
import SearchFilter from '../components/SearchFilter'
import Result from '../components/Result'

import { fetchAllCities } from '../../../api/ticket'
import { SearchResultField, SearchBoxField, Train } from '../Constant'

import dayjs from 'dayjs'
import React, { useEffect } from 'react'

const TicketSearch = () => {
  const [stations, setStations] = React.useState<Train[]>([])
  const [isSearch, setIsSearch] = React.useState(false)
  const [searchResult, setSearchResult] = React.useState<SearchResultField[]>([])
  const [searchParam, setSearchParam] = React.useState<SearchBoxField>({
    from: '',
    to: '',
    date: dayjs()
  })
  const [searchResultTrainTypeList, setSearchResultTrainTypeList] = React.useState<string[]>([])

  const convertToSearchResult = (data: SearchResultField[]) => {
    let trainTypeList: string[] = []
    for (let i = 0; i < data.length; i++) {
      data[i].begin_time = dayjs(data[i].begin_time, 'YYYY-MM-DD HH:mm:ss')
      data[i].end_time = dayjs(data[i].end_time, 'YYYY-MM-DD HH:mm:ss')
      let type = data[i].trainNo[0]
      if (trainTypeList.indexOf(type) === -1) {
        trainTypeList.push(type)
      }
      data[i].key = i + 1
    }

    setSearchResultTrainTypeList(trainTypeList)
    setSearchResult(data)
    console.log(data)
  }

  useEffect(() => {
    fetchAllCities()
      .then((res) => {
        setStations(res.data)
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <SearchBox
        stations={stations}
        isSearch={isSearch}
        setIsSearch={setIsSearch}
        setSearchResult={convertToSearchResult}
        setSearchParam={setSearchParam}
      />
      <SearchFilter
        isSearch={isSearch}
        setIsSearch={setIsSearch}
        searchParam={searchParam}
        searchResultTrainTypeList={searchResultTrainTypeList}
      />
      <Result isSearch={isSearch} searchResult={searchResult} searchParam={searchParam} />
    </>
  )
}

export default TicketSearch
