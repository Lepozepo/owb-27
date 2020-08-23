/** @jsx jsx */
import { jsx, Flex, Box, Text } from 'theme-ui';
import { IoIosAddCircle, IoIosSwap } from 'react-icons/io';
import certificates from '~/config/tmpCerts';

function description(evt) {
  switch (evt.change) {
    case 'CREATED': {
      return `Created by ${evt.createdBy}`;
    }
    case 'TRANSFERRED': {
      return `Transferred from ${evt.from} to ${evt.to}`;
    }
    default: {
      return null;
    }
  }
}

export default function EventTimeline(props = {}) {
  const { certificateId } = props;
  const certificate = certificates.find((c) => c.id === certificateId);
  return certificate.events.map((evt) => (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <Box sx={{
        borderLeft: '2px solid red',
        position: 'absolute',
        height: 'calc(100% - 20px)',
        top: 20,
        left: 9,
      }} />
      <Flex
        sx={{
          pb: 20,
        }}
      >
        {evt.change === 'CREATED' && (
          <IoIosAddCircle size="20px" />        
        )}
        {evt.change === 'TRANSFERRED' && (
          <IoIosSwap size="20px" />
        )}
        <Text>{description(evt)}</Text>
      </Flex>
    </Box>
  ));
}
