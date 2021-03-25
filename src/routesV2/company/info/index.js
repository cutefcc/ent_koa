/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Upload, message, Timeline } from 'antd'
import { resizeImg } from 'utils'
import { Button, Tab } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { formatOptions, formatCityOptions } from './utils'
import VideoList from './videoList'
import ModalForm from './ModalForm'
import ProgressForm from './ProgressForm'
import IntroForm from './IntroForm'
import styles from './index.less'

function Info({
  baseInfo,
  companyProgress,
  currentUser,
  professionInfo,
  cityInfo,
  dispatch,
}) {
  const {
    intro_content: introContent,
    intro_img: introImg,
    city,
    stage,
    domain,
    people,
    url,
  } = baseInfo
  const [proveModalVisible, setproveModalVisible] = useState(false)
  const [progressModalVisible, setProgressModalVisible] = useState(false)
  const [siteModalVisible, setSiteModalVisible] = useState(false)
  const [introModalVisible, setIntroModalVisible] = useState(false)
  const cityOptions = formatCityOptions(cityInfo)
  const professionOptions = formatOptions(professionInfo)

  // 发展进程表单配置
  const progressConfig = {
    formLayout: 'vertical',
    dataSource: {
      stage,
      profession: domain ? domain.split('·') : '',
      people,
      location: city ? city.split('·') : '',
    },
    formConfig: {
      fields: [
        {
          key: 'location',
          type: 'Cascader',
          options: cityOptions, // 可选 , 会传递给 Item组件
          formItemConfig: {
            label: '所在地区',
          },
          fieldDecoratorConfig: {
            rules: [{ required: true, message: '所在地区必填' }],
          },
        },
        {
          key: 'stage',
          type: 'Select',
          options: [
            { key: '未融资', label: '未融资' },
            { key: '天使轮', label: '天使轮' },
            { key: 'A轮', label: 'A轮' },
            { key: 'B轮', label: 'B轮' },
            { key: 'C轮', label: 'C轮' },
            { key: 'D轮及以上', label: 'D轮及以上' },
            { key: '已上市', label: '已上市' },
            { key: '不需要融资', label: '不需要融资' },
          ], // 可选 , 会传递给 Item组件
          formItemConfig: {
            label: '融资情况',
          },
          fieldDecoratorConfig: {
            rules: [{ required: true, message: '融资情况必填' }],
          },
        },
        {
          key: 'people',
          type: 'Select',
          options: [
            { key: '50人以内', label: '50人以内' },
            { key: '50~100人', label: '50~100人' },
            { key: '100~500人', label: '100~500人' },
            { key: '500~1000人', label: '500~1000人' },
            { key: '1000~10000人', label: '1000~10000人' },
            { key: '1万人以上', label: '1万人以上' },
          ],
          formItemConfig: {
            label: '人员规模',
          },
          fieldDecoratorConfig: {
            rules: [{ required: true, message: '人员规模必填' }],
          },
        },
        {
          key: 'profession',
          type: 'Cascader',
          options: professionOptions, // 可选 , 会传递给 Item组件
          formItemConfig: {
            label: '所属行业',
          },
          fieldDecoratorConfig: {
            rules: [{ required: true, message: '所属行业必填' }],
          },
        },
      ],
    },
  }
  // 公司网址表单配置
  const siteFormConfig = {
    name: 'sizeForm',
    formLayout: 'vertical',
    dataSource: {
      url,
    },
    formConfig: {
      fields: [
        {
          key: 'url',
          type: 'Input',
          formItemConfig: {
            label: '官方地址',
          },
          itemConfig: {
            maxLength: 255,
          },
          fieldDecoratorConfig: {
            rules: [
              { required: true, message: '网址必填' },
              {
                pattern: /(?!http|https):\/\/([\w.]+\/?)\S*/,
                message: '不是一个网址',
              },
            ],
          },
        },
      ],
    },
  }

  const webcid = R.pathOr(
    '',
    ['bprofileCompanyUser', 'company', 'webcid'],
    currentUser
  )

  const webuid = R.pathOr(
    '',
    ['bprofileCompanyUser', 'company', 'webuid'],
    currentUser
  )

  const cid = R.pathOr(
    '',
    ['bprofileCompanyUser', 'company', 'cid'],
    currentUser
  )

  const getBaseInfo = () => {
    dispatch({
      type: 'companyBaseInfo/getBaseInfo',
      payload: {
        webcid,
      },
    })
  }
  const getCompanyProgress = () => {
    dispatch({
      type: 'companyBaseInfo/getCompanyProgress',
      payload: {
        webcid,
      },
    })
  }

  const getVideoList = () => {
    dispatch({
      type: 'companyBaseInfo/getVideoList',
      payload: {
        webcid,
      },
    })
  }

  const getCity = () => {
    dispatch({
      type: 'companyBaseInfo/getCity',
      payload: {
        webcid,
      },
    })
  }

  const getProfession = () => {
    dispatch({
      type: 'companyBaseInfo/getProfession',
    })
  }

  const showBaseForm = () => {
    getCity()
    getProfession()
    setproveModalVisible(true)
  }

  useEffect(() => {
    if (!webcid) return
    getBaseInfo()
    getCompanyProgress()
    getVideoList()
  }, [webcid])

  const handleUploadChange = (data) => {
    // setfile(data.file)
    const { response: { file_path: filePath } = {} } = data.file
    if (filePath) {
      // 更改基本信息
      dispatch({
        type: 'companyBaseInfo/setBaseInfo',
        payload: {
          ...baseInfo,
          clogo: filePath,
          webcid,
        },
      }).then(() => {
        dispatch({
          type: 'global/fetchCurrentUser',
        })
      })
    }

    if (data.file.status === 'error') {
      message.error('文件太大')
    }
  }

  const renderClogo = () => {
    return (
      <div className={styles.infoItem}>
        <p className={styles.infoLabel}>企业号logo</p>
        <div className={styles.infoValue}>
          <Upload
            accept=".png,.jpg,.jpeg"
            action="/upfile_for_company"
            listType="picture-card"
            showUploadList={false}
            name="fdata"
            data={() => ({
              kos: 1,
              ftype: 2,
              webuid: currentUser.bprofileCompanyUser.company.webuid,
            })}
            transformFile={(file) => {
              return new Promise((resolve) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                  resizeImg(reader.result, (data) => {
                    resolve(data)
                  })
                }
              })
            }}
            className={styles.clogoUploader}
            onChange={handleUploadChange}
          >
            {baseInfo.clogo ? (
              <span className={styles.clogo}>
                <img
                  src={baseInfo.clogo}
                  alt="empty"
                  style={{ width: '100%', height: '100%' }}
                />
              </span>
            ) : (
              <div>
                <PlusOutlined />
              </div>
            )}
          </Upload>
          <span className={styles.clogoInfoTips}>
            *建议尺寸200*200px，格式支持jpg、png，大小不超过2M。
          </span>
        </div>
      </div>
    )
  }

  const handleSubmit = (values) => {
    dispatch({
      type: 'companyBaseInfo/setBaseInfo',
      payload: {
        ...baseInfo,
        webcid,
        ...values,
      },
    }).then(() => {
      setproveModalVisible(false)
      getBaseInfo()
    })
  }
  const onCancel = () => {
    setproveModalVisible(false)
  }

  const onCreateProgress = (value) => {
    dispatch({
      type: 'companyBaseInfo/editProgress',
      payload: {
        ...value,
        webcid,
        cid,
      },
    }).then(() => {
      getCompanyProgress()
    })
  }

  const tabsConfig = [
    {
      title: '基础信息',
      key: 1,
    },
  ]

  return (
    <div className={styles.infoWrap}>
      <Tab
        tabs={tabsConfig}
        activeKeys={[1]}
        type="large"
        style={{ borderBottom: '1px solid #F2F4F8', paddingLeft: '24px' }}
      />
      <div className={styles.infos}>
        {renderClogo()}
        <VideoList />
        <div className={styles.infoItem}>
          <p className={styles.infoLabel}>公司介绍</p>
          <div className={styles.infoValue}>
            <div>
              <p style={{ margin: 0 }}>{introContent}</p>
              {introImg ? (
                <img
                  style={{ maxWidth: 100, maxHeight: 100, marginTop: 10 }}
                  src={introImg}
                />
              ) : null}
            </div>
            <Button
              type="button_m_exact_link_blue"
              onClick={() => {
                setIntroModalVisible(true)
              }}
            >
              设置
            </Button>
          </div>
        </div>
        <div className={styles.infoItem}>
          <p className={styles.infoLabel}>基本状况</p>
          <div className={styles.infoValue}>
            <div>
              {city} | {stage} | {domain} | {people}
            </div>
            <Button
              type="button_m_exact_link_blue"
              onClick={() => {
                showBaseForm()
              }}
            >
              设置
            </Button>
          </div>
        </div>
        <div className={styles.infoItem}>
          <p className={styles.infoLabel}>官网地址</p>

          <div className={styles.infoValue}>
            <div>{url}</div>
            <Button
              type="button_m_exact_link_blue"
              onClick={() => {
                setSiteModalVisible(true)
              }}
            >
              设置
            </Button>
          </div>
        </div>
        <div className={styles.infoItem}>
          <p className={styles.infoLabel}>发展历程</p>
          <div className={styles.infoValue} style={{ paddingBottom: 0 }}>
            <div className={styles.companyProgress}>
              <div className={styles.progressDesc}>
                <Timeline>
                  {companyProgress.map((data) => {
                    return (
                      <Timeline.Item>
                        <p className={styles.progressTime}>
                          {data.year}年{data.month}月{' '}
                        </p>
                        {data.desc}
                      </Timeline.Item>
                    )
                  })}
                </Timeline>
              </div>
            </div>
            <Button
              type="button_m_exact_link_blue"
              onClick={() => {
                setProgressModalVisible(true)
              }}
            >
              设置
            </Button>
          </div>
        </div>
      </div>
      {proveModalVisible && (
        <ModalForm
          title="基本状况设置"
          config={progressConfig}
          visible={true}
          onSubmit={(values) => {
            /* eslint-disable */

            values.city = values.location.join('·')
            /* eslint-disable */

            values.domain = values.profession.join('·')
            /* eslint-disable */

            delete values.location
            /* eslint-disable */

            delete values.profession
            handleSubmit(values)
          }}
          onCancel={onCancel}
        />
      )}
      {siteModalVisible && (
        <ModalForm
          title="官网地址设置"
          config={siteFormConfig}
          visible={true}
          onSubmit={(values) => {
            handleSubmit(values)
            setSiteModalVisible(false)
          }}
          onCancel={() => {
            setSiteModalVisible(false)
          }}
        />
      )}

      {introModalVisible && (
        <IntroForm
          formParams={{
            webuid,
          }}
          introContent={introContent}
          introImg={introImg}
          onCancel={() => setIntroModalVisible(false)}
          onOk={(formValue) => {
            dispatch({
              type: 'companyBaseInfo/setIntroduce',
              payload: {
                webcid,
                ...formValue,
              },
            }).then(() => {
              message.success('保存公司介绍成功')
              setIntroModalVisible(false)
              getBaseInfo()
            })
          }}
        />
      )}

      {progressModalVisible && (
        <ProgressForm
          onCreate={onCreateProgress}
          onCancel={() => setProgressModalVisible(false)}
          onEdit={(index) => {
            dispatch({
              type: 'companyBaseInfo/editCompanyProgress',
              payload: {
                index,
              },
            })
          }}
          onSave={(payload) => {
            dispatch({
              type: 'companyBaseInfo/editProgress',
              payload: {
                webcid,
                ...payload,
              },
            }).then(() => {
              message.success('保存发展历程成功')
              getCompanyProgress()
            })
          }}
          onDel={(id) => {
            dispatch({
              type: 'companyBaseInfo/delProgress',
              payload: {
                history_id: id,
                webcid,
              },
            }).then(() => {
              message.success('删除发展历程成功')
              getCompanyProgress()
            })
          }}
          data={companyProgress}
        />
      )}
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  config: state.global.config,
  baseInfo: state.companyBaseInfo.baseInfo,
  companyProgress: state.companyBaseInfo.companyProgress,
  videoList: state.companyBaseInfo.videoList,
  cityInfo: state.companyBaseInfo.cityInfo,
  professionInfo: state.companyBaseInfo.professionInfo,
  dispatch,
}))(Info)
