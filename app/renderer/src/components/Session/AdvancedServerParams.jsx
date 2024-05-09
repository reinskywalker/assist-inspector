import {Checkbox, Col, Collapse, Form, Row} from 'antd';
import React from 'react';

import styles from './Session.module.css';

const AdvancedServerParams = ({server, setServerParam, serverType, t}) => (
  <Row gutter={8}>
    <Col className={styles.advancedSettingsContainerCol}>
      <div className={styles.advancedSettingsContainer}>
        <Collapse bordered={true}>
          <Collapse.Panel header={t('Advanced Settings')}>
            <Row>
              {serverType !== 'lambdatest' && (
                <Col span={7}>
                  <Form.Item>
                    <Checkbox
                      checked={!!server.advanced.allowUnauthorized}
                      onChange={(e) =>
                        setServerParam('allowUnauthorized', e.target.checked, 'advanced')
                      }
                    >
                      {t('allowUnauthorizedCerts')}
                    </Checkbox>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Collapse.Panel>
        </Collapse>
      </div>
    </Col>
  </Row>
);

export default AdvancedServerParams;
