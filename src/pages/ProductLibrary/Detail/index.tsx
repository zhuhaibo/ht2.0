import { PageContainer } from "@ant-design/pro-components";
import { useParams } from "@umijs/max"

export default function(){
  const params = useParams();

  return <>
    <PageContainer title={`Detail: ${params.id}`} subTitle={false}>
      new pages {params.id}
    </PageContainer>
  </>
}