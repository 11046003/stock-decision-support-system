import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Select, Radio, Card, Col, Row, Statistic } from 'antd';
import fakeChart from '../assets/images/chart.png';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { StockRequest } from '../api/request/stockRequest.js';

const { Option } = Select;

const StockInfo = ({ id }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddPortfolioModalVisible, setIsAddPortfolioModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('buyAndHold');
  const [customAmount, setCustomAmount] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [portfolioName, setPortfolioName] = useState('');
  const [formData, setFormData] = useState({});
  const [formattedDate, setFormattedDate] = useState('');

  const priceColor = formData.change_price < 0 ? '#09CF41' : '#dc3545';
  const changeIcon = formData.change_price < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />;

  const stockPrice = 841.00;
  const buyAndHoldAmount = 100;
  const naiveAmount = 200;

  useEffect(() => {
    const fetchStockData = async () => {
      StockRequest.getStock(id)
        .then(response => {
          setFormData(response.data);
          const millisecondsTimestamp = response.data.ts / 1e6;
          const date = new Date(millisecondsTimestamp);
          const getDay = date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0') + ' ' +
            String(date.getHours()).padStart(2, '0') + ':' +
            String(date.getMinutes()).padStart(2, '0') + ':' +
            String(date.getSeconds()).padStart(2, '0');
          setFormattedDate(getDay);
        })
        .catch((error) => {
          alert(error.message);
        });
    };

    fetchStockData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOptionChange = e => {
    setSelectedOption(e.target.value);
    if (e.target.value === 'buyAndHold') {
      setTotalPrice(buyAndHoldAmount * stockPrice);
    } else if (e.target.value === 'naive') {
      setTotalPrice(naiveAmount * stockPrice);
    }
  };

  const handleCustomAmountChange = e => {
    const amount = e.target.value;
    setCustomAmount(amount);
    setTotalPrice(amount * stockPrice);
  };

  const handleAddPortfolioClick = () => {
    setIsAddPortfolioModalVisible(true);
  };

  const handleAddPortfolioOk = () => {
    console.log('New portfolio name:', portfolioName);
    setIsAddPortfolioModalVisible(false);
    setPortfolioName('');
  };

  const handleAddPortfolioCancel = () => {
    setIsAddPortfolioModalVisible(false);
  };

  return (
    <div className="stock-info">
      <p>最後更新時間 {formattedDate}</p>
      <h2>
        {formData.name} {id}
        <Button
          type="primary"
          onClick={showModal}
          style={{ marginLeft: '10px', backgroundColor: '#CD4444', borderColor: '#CD4444' }}
        >
          新增至投資組合
        </Button>
      </h2>

      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="價格"
            value={formData.close}
            precision={2}
            valueStyle={{ color: priceColor }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="漲跌幅"
            value={formData.change_rate}
            precision={2}
            valueStyle={{ color: priceColor }}
            prefix={changeIcon}
            suffix="%"
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={5}>
          <Statistic title="開盤價" value={formData.open} precision={2} />
        </Col>
        <Col span={5}>
          <Statistic title="收盤價" value={formData.close} precision={2} />
        </Col>
        <Col span={5}>
          <Statistic title="最高價" value={formData.high} precision={2} />
        </Col>
        <Col span={5}>
          <Statistic title="最低價" value={formData.low} precision={2} />
        </Col>
        <Col span={4}>
          <Statistic title="單量" value={formData.volume} precision={2} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={5}>
          <Statistic title="成交量" value={formData.total_volume} />
        </Col>
        {/*<Col span={5}>
          <Statistic title="本益比" value={formData.pe_ratio} precision={2} />
        </Col>
        <Col span={5}>
          <Statistic title="同業平均" value={formData.pe_ratio_industry_avg} precision={2} />
        </Col>*/}
      </Row>
      <div className="stock-chart">
        <img src={fakeChart} alt="Stock Chart" />
      </div>

      <Modal title={<h3>台積電 {id}</h3>} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <div>
            <Radio.Group onChange={handleOptionChange} value={selectedOption}>
              <Radio value="buyAndHold">Buy and Hold</Radio>
              <Radio value="naive" style={{ marginLeft: '10px' }}>Naive</Radio>
              <Radio value="custom" style={{ marginLeft: '10px' }}>自訂</Radio>
            </Radio.Group>
            <div style={{ marginTop: '10px' }}>
              <Input
                type="number"
                value={selectedOption === 'custom' ? customAmount : (selectedOption === 'buyAndHold' ? buyAndHoldAmount : naiveAmount)}
                onChange={handleCustomAmountChange}
                placeholder="輸入股數"
                style={{ width: '150px', marginRight: '10px' }}
              />
              <span>現時股價：{stockPrice.toFixed(2)} 總花費: {(selectedOption === 'custom' || selectedOption === 'buyAndHold' || selectedOption === 'naive') && totalPrice.toFixed(2)} 元</span>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Select placeholder="選擇投資組合" style={{ width: '200px', marginRight: '10px' }}>
              <Option value="portfolio1">投資組合 1</Option>
              <Option value="portfolio2">投資組合 2</Option>
              <Option value="portfolio3">投資組合 3</Option>
            </Select>
            <Button type="primary" onClick={handleAddPortfolioClick}>新增投資組合</Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="新增投資組合"
        visible={isAddPortfolioModalVisible}
        onOk={handleAddPortfolioOk}
        onCancel={handleAddPortfolioCancel}
      >
        <Input
          value={portfolioName}
          onChange={e => setPortfolioName(e.target.value)}
          placeholder="輸入投資組合名稱"
        />
      </Modal>
    </div>
  );
};

export default StockInfo;
