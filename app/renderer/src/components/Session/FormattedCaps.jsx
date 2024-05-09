import {CloseOutlined, EditOutlined, SaveOutlined} from '@ant-design/icons';
import {Alert, Button, Collapse, Card, Tooltip} from 'antd';
import hljs from 'highlight.js';
import React from 'react';

import {getCapsObject} from '../../actions/Session.js';
import {ALERT} from '../../constants/antd-types.js';
import SessionStyles from './Session.module.css';

const FormattedCaps = (props) => {
  const {
    caps,
    title,
    desiredCapsName,
    isEditingDesiredCapsName,
    isEditingDesiredCaps,
    startDesiredCapsEditor,
    abortDesiredCapsEditor,
    saveRawDesiredCaps,
    setRawDesiredCaps,
    rawDesiredCaps,
    isValidCapsJson,
    invalidCapsJsonReason,
    t,
  } = props;

  const getHighlightedCaps = (caps) => {
    const formattedJson = JSON.stringify(getCapsObject(caps), null, 2);
    return hljs.highlight(formattedJson, {language: 'json'}).value;
  };

  const setCapsTitle = () => {
    const {setDesiredCapsName} = props;
    if (!title) {
      return t('Capability Builder - JSON');
    } else if (!isEditingDesiredCapsName) {
      return title;
    } else {
      return (
        <input
          onChange={(e) => setDesiredCapsName(e.target.value)}
          value={desiredCapsName}
          className={SessionStyles.capsEditorTitle}
        />
      );
    }
  };

  const setCapsTitleButtons = () => {
    const {startDesiredCapsNameEditor, abortDesiredCapsNameEditor, saveDesiredCapsName} = props;
    if (!title) {
      return null;
    } else if (!isEditingDesiredCapsName) {
      return (
        <Tooltip title={t('Edit')}>
          <Button
            size="small"
            onClick={startDesiredCapsNameEditor}
            icon={<EditOutlined />}
            className={SessionStyles.capsNameEditorButton}
          />
        </Tooltip>
      );
    } else {
      return (
        <div>
          <Tooltip title={t('Cancel')}>
            <Button
              size="small"
              onClick={abortDesiredCapsNameEditor}
              icon={<CloseOutlined />}
              className={SessionStyles.capsNameEditorButton}
            />
          </Tooltip>
          <Tooltip title={t('Save')}>
            <Button
              size="small"
              onClick={saveDesiredCapsName}
              icon={<SaveOutlined />}
              className={SessionStyles.capsNameEditorButton}
            />
          </Tooltip>
        </div>
      );
    }
  };

  return (
    caps && (
      <Card
        className={SessionStyles.formattedCaps}
        title={setCapsTitle()}
        extra={setCapsTitleButtons()}
      >
        <div className={SessionStyles.capsEditorControls}>
          {isEditingDesiredCaps && (
            <Tooltip title={t('Cancel')}>
              <Button
                onClick={abortDesiredCapsEditor}
                icon={<CloseOutlined />}
                className={SessionStyles.capsEditorButton}
              />
            </Tooltip>
          )}
          {isEditingDesiredCaps && (
            <Tooltip title={t('Save')}>
              <Button
                onClick={saveRawDesiredCaps}
                icon={<SaveOutlined />}
                className={SessionStyles.capsEditorButton}
              />
            </Tooltip>
          )}
          {!isEditingDesiredCaps && (
            <Tooltip title={t('Edit JSON')} placement="topRight">
              <Button onClick={startDesiredCapsEditor} icon={<EditOutlined />} />
            </Tooltip>
          )}
        </div>
        {isEditingDesiredCaps && (
          <div className={SessionStyles.capsEditor}>
            <textarea
              onChange={(e) => setRawDesiredCaps(e.target.value)}
              value={rawDesiredCaps}
              className={`${SessionStyles.capsEditorBody} ${
                isValidCapsJson
                  ? SessionStyles.capsEditorBodyFull
                  : SessionStyles.capsEditorBodyResized
              }`}
            />
            {!isValidCapsJson && <Alert message={invalidCapsJsonReason} type={ALERT.ERROR} />}
          </div>
        )}
        {!isEditingDesiredCaps && (
          <div className={SessionStyles.formattedCapsBody}>
            <pre>
              <code dangerouslySetInnerHTML={{__html: getHighlightedCaps(caps)}} />
            </pre>
          </div>
        )}
      </Card>
    )
  );
};

export default FormattedCaps;
