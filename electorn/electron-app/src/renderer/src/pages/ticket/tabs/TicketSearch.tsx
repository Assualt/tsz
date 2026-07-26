import SearchBox from '../components/SearchBox'
import SearchFilter from '../components/SearchFilter'
import Result from '../components/Result'

import { fetchAllCities } from '../../../api/ticket'
import { SearchResultField, SearchBoxField, Train } from '../constants'

import dayjs from 'dayjs'
import React, { useEffect, useState, useRef } from 'react'

const TicketSearch = (): JSX.Element => {
  const [stations, setStations] = React.useState<Train[]>([])
  const [isSearch, setIsSearch] = React.useState(false)
  const [searchResult, setSearchResult] = React.useState<SearchResultField[]>([])
  const [showResult, setShowResult] = React.useState(false)
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [searchParam, setSearchParam] = React.useState<SearchBoxField>({
    from: '',
    to: '',
    date: dayjs()
  })
  const [searchResultTrainTypeList, setSearchResultTrainTypeList] = React.useState<string[]>([])
  const [initialSearchValues, setInitialSearchValues] = useState<{
    from: string
    to: string
    date: string
  } | null>(null)
  const [triggerSearch, setTriggerSearch] = useState(false)

  const convertToSearchResult = (data: SearchResultField[]): void => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }

    setShowResult(false)

    transitionTimerRef.current = setTimeout(() => {
      const trainTypeList: string[] = []
      for (let i = 0; i < data.length; i++) {
        data[i].begin_time = dayjs(data[i].begin_time, 'YYYY-MM-DD HH:mm:ss')
        data[i].end_time = dayjs(data[i].end_time, 'YYYY-MM-DD HH:mm:ss')
        const type = data[i].train_num[0]
        if (trainTypeList.indexOf(type) === -1) {
          trainTypeList.push(type)
        }
        data[i].key = i + 1
      }

      setSearchResultTrainTypeList(trainTypeList)
      setSearchResult(data)
      setShowResult(true)
      console.log(data)
    }, 1000)
  }

  useEffect(() => {
    fetchAllCities()
      .then((res) => {
        const stations: Train[] = []
        for (let i = 0; i < res.data.length; i++) {
          stations.push({
            value: res.data[i]?.code,
            label: res.data[i]?.name,
            code: res.data[i]?.code
          })
        }
        setStations(stations)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    const autoSearch = localStorage.getItem('autoSearch')
    const searchParams = localStorage.getItem('searchParams')

    if (autoSearch === 'true' && searchParams) {
      try {
        const params = JSON.parse(searchParams)
        if (params.from && params.to) {
          setInitialSearchValues({
            from: params.from,
            to: params.to,
            date: params.date || dayjs().format('YYYY-MM-DD')
          })
          setSearchParam({
            from: params.from,
            to: params.to,
            date: dayjs(params.date)
          })
        }
      } catch (e) {
        console.error('Failed to parse search params:', e)
      }
    }

    localStorage.removeItem('autoSearch')
    localStorage.removeItem('searchParams')
  }, [])

  useEffect(() => {
    if (initialSearchValues && stations.length > 0) {
      setTriggerSearch(true)
    }
  }, [initialSearchValues, stations])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <SearchBox
        stations={stations}
        isSearch={isSearch}
        setIsSearch={setIsSearch}
        setSearchResult={convertToSearchResult}
        setSearchParam={setSearchParam}
        initialSearchValues={initialSearchValues || undefined}
        triggerSearch={triggerSearch}
      />
      <SearchFilter
        isSearch={isSearch}
        setIsSearch={setIsSearch}
        searchParam={searchParam}
        searchResultTrainTypeList={searchResultTrainTypeList}
      />
      <Result
        isSearch={isSearch}
        searchResult={searchResult}
        searchParam={searchParam}
        showResult={showResult}
      />
    </>
  )
}

export default TicketSearch
