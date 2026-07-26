import React from 'react'
import { Button, Result } from 'antd'
import Copyright from '@renderer/components/Copyright'

const PageNotFound: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#f5f6f8'
    }}
  >
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => {
              location.href = '/'
            }}
          >
            Back Home
          </Button>
        }
      ></Result>
    </div>
    <Copyright />
  </div>
)

export default PageNotFound
